'use client'
import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import * as z from 'zod'
import { ArrowLeft, ImagePlus, MapPin, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';


import { CldUploadButton } from 'next-cloudinary';
const Map = dynamic(() => import('@/app/components/Map'), {
    ssr: false,
});

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface LocationContextType {
    coords: Coordinates | null;
    setCoords: Dispatch<SetStateAction<Coordinates | null>>;
}

export const LocationContext = createContext<LocationContextType | null>(null)


const reportSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required."), // Prevents empty strings

    title: z
        .string()
        .min(3, "Report title must be at least 3 characters.")
        .max(32, "Report title must be at most 32 characters."),

    description: z
        .string().nullish(),


    address: z
        .string()
        .min(1, "Address is required."), // Prevents empty strings

    landmark: z
        .string()
        .min(1, "Landmark is required."), // Prevents empty strings

    zip: z.coerce
        .number()
        .min(10000),
    latitude: z.string(),
    longitude: z.string(),

    severity: z.enum(["LOW", "MEDIUM", "HIGH"]),
    images: z.array(z.string().url()).min(1, "Upload at least one image."),

});

type ReportData = z.infer<typeof reportSchema>;
type FormErrors = Partial<Record<keyof z.infer<typeof reportSchema>, string>>;

const HomePage = () => {




    const [coords, setCoords] = useState<Coordinates | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [value, setValue] = useState<number>(0)
    const [errors, setErrors] = useState<FormErrors>({})
    const [imageUrls, setImageUrls] = useState<string[]>([])

    useEffect(() => {
        console.log("Loc :", coords)
        // handleGetLocation()
    }, [coords])


    const handleGetLocation = () => {
        // Check if the browser supports Geolocation
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            },
            {
                enableHighAccuracy: true, // Request precise location GPS data if available
                timeout: 10000,          // Stop trying after 10 seconds
                maximumAge: 0,           // Do not use a cached location
            }
        );
    };



    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({}); // Reset error state on new submit

        const form = e.currentTarget;

        const formData = new FormData(form);


        if (typeof coords !== "undefined" && coords) {
            formData.append("latitude", coords.latitude.toFixed(4).toString());
            formData.append("longitude", coords.longitude.toFixed(4).toString());
        }

        const rawData = {
            ...Object.fromEntries(formData.entries()),
            images: imageUrls,
        };
        console.log("Raw data:", rawData)
        const result = reportSchema.safeParse(rawData);
        console.log("res :", result)

        if (!result.success) {
            // Flatten errors into an easy-to-read { fieldName: "error message" } object
            const fieldErrors = result.error.flatten().fieldErrors;
            const formattedErrors: FormErrors = {};

            for (const key in fieldErrors) {
                if (fieldErrors[key as keyof typeof fieldErrors]) {
                    formattedErrors[key as keyof FormErrors] = fieldErrors[key as keyof typeof fieldErrors]![0];
                }
            }
            setErrors(formattedErrors);
            toast.error("Please complete all required fields before submitting.", {
                position: "top-right",
            });
            return;
        }

        // Success path
        console.log("Validated Form Data:", result.data);

        fetch("/api/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(result.data),
        }).then(res => res.json()).then(data => {
            console.log(data)
            if (data.success) {
                toast.success(data.message, {
                    position: "top-right"
                })
                form.reset();
                setImageUrls([]);
            } else {
                toast.warning(data.message, {
                    position: "top-right"
                })
            }
        })
            .catch(err => console.log("Error :", err));


    };



   

    return (
        <LocationContext.Provider value={{ coords, setCoords }}>
            <div className='min-h-screen px-4 py-6 sm:px-6 sm:py-10'>
                <div className='mx-auto w-full max-w-5xl'>
                    <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-emerald-200"><ArrowLeft className="size-4" /> Back to home</Link>
                    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                        <div><p className="text-sm font-medium text-emerald-300">Community tree care</p><h1 className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Report a fallen tree</h1><p className="mt-2 max-w-xl text-sm leading-6 text-neutral-400">Your report helps local teams identify hazards and plan the fastest response.</p></div>
                        <div className="hidden items-center gap-2 rounded-xl border border-emerald-300/10 bg-emerald-300/5 px-3 py-2 text-xs text-emerald-100 sm:flex"><ShieldCheck className="size-4 text-emerald-300" /> Details are used only for this report</div>
                    </div>

                <form onSubmit={handleSubmit} className='rounded-3xl border border-white/10 bg-neutral-900/75 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-8 md:p-10'>
                    <FieldSet className='w-full'>
                        <FieldLegend className='sr-only'>Report fallen tree</FieldLegend>

                        <FieldGroup>
                            {/* --- Name Field --- */}
                            <Field >
                                <FieldLabel htmlFor="name">Full Name <span className="text-destructive">*</span></FieldLabel>
                                <Input id="name" name="name" autoComplete="name" placeholder="Your full name" className='h-11 bg-white/5' />
                                {errors.name && <FieldError className="text-destructive text-sm mt-1">{errors.name}</FieldError>}
                            </Field>

                            {/* --- Title Field --- */}
                            <Field >
                                <FieldLabel htmlFor="title">Title <span className="text-destructive">*</span></FieldLabel>
                                <Input id="title" name='title' autoComplete="off" placeholder="e.g. Large tree blocking the road" className='h-11 bg-white/5' />
                                {errors.title && <FieldError className="text-destructive text-sm mt-1">{errors.title}</FieldError>}
                            </Field>

                            {/* --- Description Field --- */}
                            <Field >
                                <FieldLabel htmlFor="description">Description <span className="text-destructive">*</span></FieldLabel>
                                <Textarea id="description" name='description' autoComplete="off" placeholder="Include any immediate hazards or access issues." className='min-h-28 bg-white/5' />
                                <FieldDescription>Describe the incident.</FieldDescription>
                                {errors.description && <FieldError className="text-destructive text-sm mt-1">{errors.description}</FieldError>}
                            </Field>
                        </FieldGroup>

                        <FieldGroup>
                            {/* --- Address Field --- */}
                            <Field >
                                <FieldLabel htmlFor="street">Street Address<span className="text-destructive">*</span></FieldLabel>
                                <Input id="street" name='address' type="text" placeholder="123 Main St" className='h-11 bg-white/5' />
                                {errors.address && <FieldError className="text-destructive text-sm mt-1">{errors.address}</FieldError>}
                            </Field>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* --- Landmark Field --- */}
                                <Field >
                                    <FieldLabel htmlFor="landmark">Landmark<span className="text-destructive">*</span></FieldLabel>
                                    <Input id="landmark" name='landmark' type="text" placeholder="Near petrol pump" className='h-11 bg-white/5' />
                                    {errors.landmark && <FieldError className="text-destructive text-sm mt-1">{errors.landmark}</FieldError>}
                                </Field>

                                {/* --- Zip Code Field --- */}
                                <Field >
                                    <FieldLabel htmlFor="zip">Postal Code<span className="text-destructive">*</span> </FieldLabel>
                                    <Input id="zip" name='zip' type="text" inputMode="numeric" placeholder="400032" className='h-11 bg-white/5' />
                                    {errors.zip && <FieldError className="text-destructive text-sm mt-1">{errors.zip}</FieldError>}
                                </Field>
                            </div>
                        </FieldGroup>

                        {/* --- Image Field --- */}
                        <Field>
                            <FieldLabel htmlFor="img">Upload Image <span className="text-destructive">*</span></FieldLabel>
                            <CldUploadButton
                                uploadPreset="tree_reports"
                                options={{ multiple: true, maxFiles: 3, resourceType: "image" }}
                                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-300/15 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                onSuccess={(result) => {
                                    const uploadedImage = result.info;

                                    if (typeof uploadedImage === "string" || !uploadedImage) return;

                                    const imageUrl = uploadedImage.secure_url;

                                    setImageUrls((currentImages) =>
                                        currentImages.includes(imageUrl)
                                            ? currentImages
                                            : [...currentImages, imageUrl],
                                    );
                                }}
                                onError={() => toast.error("Image upload failed. Please try again.")}
                            >
                                <ImagePlus className="size-4" />
                                Upload images
                            </CldUploadButton>
                            <FieldDescription>Upload up to 3 images of the incident.</FieldDescription>
                            {errors.images && <FieldError className="text-destructive text-sm mt-1">{errors.images}</FieldError>}
                            {imageUrls.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                    {imageUrls.map((imageUrl) => (
                                        <div key={imageUrl} className="group relative aspect-square overflow-hidden rounded-md border">
                                            <Image src={imageUrl} alt="Uploaded incident" fill className="object-cover" />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 size-7 opacity-0 transition-opacity group-hover:opacity-100"
                                                onClick={() => setImageUrls((currentImages) => currentImages.filter((url) => url !== imageUrl))}
                                            >
                                                <X className="size-4" />
                                                <span className="sr-only">Remove image</span>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Field>



                        <div className="overflow-hidden rounded border border-white/10">
                            <Map height="260px" />
                        </div>
                        <FieldDescription className='flex items-center gap-2 text-emerald-300'>
                            <MapPin className="size-4" /> Check that the location marker is correct.
                        </FieldDescription>

                        {/* --- Severity Field --- */}
                        <Field >
                            <FieldLegend variant="label">Select Severity <span className="text-destructive">*</span></FieldLegend>
                            <FieldDescription>How severe is the condition.</FieldDescription>
                            <RadioGroup defaultValue="LOW" name='severity' className="grid gap-2 sm:grid-cols-3">
                                <Field orientation="horizontal" className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2.5">
                                    <RadioGroupItem value="LOW" id="severity-low" />
                                    <FieldLabel htmlFor="severity-low" className="font-normal">Low</FieldLabel>
                                </Field>
                                <Field orientation="horizontal" className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-3 py-2.5">
                                    <RadioGroupItem value="MEDIUM" id="severity-medium" />
                                    <FieldLabel htmlFor="severity-medium" className="font-normal">Medium</FieldLabel>
                                </Field>
                                <Field orientation="horizontal" className="rounded-xl border border-rose-400/20 bg-rose-400/5 px-3 py-2.5">
                                    <RadioGroupItem value="HIGH" id="severity-high" />
                                    <FieldLabel htmlFor="severity-high" className="font-normal">High</FieldLabel>
                                </Field>
                            </RadioGroup>
                            {errors.severity && <FieldError className="text-destructive text-sm mt-1">{errors.severity}</FieldError>}
                        </Field>

                        <Button type='submit' className='mt-2 h-12 w-full rounded-xl bg-emerald-300 text-base font-semibold text-emerald-950 hover:bg-emerald-200'>Submit report</Button>
                    </FieldSet>
                </form>
                </div>
            </div>
        </LocationContext.Provider>)
}

export default HomePage
