'use client'
import React, { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import * as z from 'zod'
import { Landmark } from 'lucide-react';
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
    // latitude: z.string(),
    // longitude: z.string(),

    severity: z.enum(["low", "medium", "high"])

});

type ReportData = z.infer<typeof reportSchema>;
type FormErrors = Partial<Record<keyof z.infer<typeof reportSchema>, string>>;

const HomePage = () => {




    const [coords, setCoords] = useState<Coordinates | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [value, setValue] = useState<number>(0)
    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => {
        console.log("Loc :", coords)
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

        const formData = new FormData(e.currentTarget);

        // Optional coords logic from your previous snippet
        if (typeof coords !== "undefined" && coords) {
            formData.append("latitude", coords.latitude.toFixed(4).toString());
            formData.append("longitude", coords.longitude.toFixed(4).toString());
        }

        const rawData = Object.fromEntries(formData.entries());
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
            return;
        }

        // Success path
        console.log("Validated Form Data:", result.data);
    };



    // const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     const formData = new FormData(e.currentTarget);
    //     if (coords) {
    //         formData.append("latitude", coords.latitude.toFixed(4).toString());
    //         formData.append("longitude", coords.longitude.toFixed(4).toString());
    //     }
    //     const data = Object.fromEntries(formData.entries());

    //     console.log("Form Submitted Data:", data);

    // };

    return (
        <LocationContext.Provider value={{ coords, setCoords }}>
            <div className='min-h-screen border flex flex-col items-center justify-center '>

                <form onSubmit={handleSubmit} className='border shadow-xl shadow-neutral-900 md:px-16 p-6 rounded-2xl w-full max-w-lg h-full flex flex-col justify-around items-center gap-6'>
                    <FieldSet className='w-full'>
                        <FieldLegend className='text-3xl! text-center'>Report Fallen Tree</FieldLegend>

                        <FieldGroup>
                            {/* --- Name Field --- */}
                            <Field >
                                <FieldLabel htmlFor="name">Full Name <span className="text-destructive">*</span></FieldLabel>
                                <Input id="name" name="name" autoComplete="off" className='text-2xl' />
                                {errors.name && <FieldError className="text-destructive text-sm mt-1">{errors.name}</FieldError>}
                            </Field>

                            {/* --- Title Field --- */}
                            <Field >
                                <FieldLabel htmlFor="title">Title <span className="text-destructive">*</span></FieldLabel>
                                <Input id="title" name='title' autoComplete="off" />
                                {errors.title && <FieldError className="text-destructive text-sm mt-1">{errors.title}</FieldError>}
                            </Field>

                            {/* --- Description Field --- */}
                            <Field >
                                <FieldLabel htmlFor="description">Description <span className="text-destructive">*</span></FieldLabel>
                                <Textarea id="description" name='description' autoComplete="off" />
                                <FieldDescription>Describe the incident.</FieldDescription>
                                {errors.description && <FieldError className="text-destructive text-sm mt-1">{errors.description}</FieldError>}
                            </Field>
                        </FieldGroup>

                        <FieldGroup>
                            {/* --- Address Field --- */}
                            <Field >
                                <FieldLabel htmlFor="street">Street Address<span className="text-destructive">*</span></FieldLabel>
                                <Input id="street" name='address' type="text" placeholder="123 Main St" />
                                {errors.address && <FieldError className="text-destructive text-sm mt-1">{errors.address}</FieldError>}
                            </Field>

                            <div className="grid grid-cols-2 gap-4">
                                {/* --- Landmark Field --- */}
                                <Field >
                                    <FieldLabel htmlFor="landmark">Landmark<span className="text-destructive">*</span></FieldLabel>
                                    <Input id="landmark" name='landmark' type="text" placeholder="Near Petrol pump" />
                                    {errors.landmark && <FieldError className="text-destructive text-sm mt-1">{errors.landmark}</FieldError>}
                                </Field>

                                {/* --- Zip Code Field --- */}
                                <Field >
                                    <FieldLabel htmlFor="zip">Postal Code<span className="text-destructive">*</span> </FieldLabel>
                                    <Input id="zip" name='zip' type="text" placeholder="400032" />
                                    {errors.zip && <FieldError className="text-destructive text-sm mt-1">{errors.zip}</FieldError>}
                                </Field>
                            </div>
                        </FieldGroup>

                        {/* --- Image Field --- */}
                        <Field>
                            <FieldLabel htmlFor="img">Upload Image <span className="text-destructive">*</span></FieldLabel>
                            <Input id="img" name='img' type="file" />
                        </Field>

                        <FieldDescription className='text-green-500'>
                            Check if location is marked correctly.
                        </FieldDescription>

                        {/* --- Severity Field --- */}
                        <Field >
                            <FieldLegend variant="label">Select Severity <span className="text-destructive">*</span></FieldLegend>
                            <FieldDescription>How severe is the condition.</FieldDescription>
                            <RadioGroup defaultValue="low" name='severity'>
                                <Field orientation="horizontal">
                                    <RadioGroupItem value="low" id="severity-low" />
                                    <FieldLabel htmlFor="severity-low" className="font-normal">Low</FieldLabel>
                                </Field>
                                <Field orientation="horizontal">
                                    <RadioGroupItem value="medium" id="severity-medium" />
                                    <FieldLabel htmlFor="severity-medium" className="font-normal">Medium</FieldLabel>
                                </Field>
                                <Field orientation="horizontal">
                                    <RadioGroupItem value="high" id="severity-high" />
                                    <FieldLabel htmlFor="severity-high" className="font-normal">High</FieldLabel>
                                </Field>
                            </RadioGroup>
                            {errors.severity && <FieldError className="text-destructive text-sm mt-1">{errors.severity}</FieldError>}
                        </Field>

                        <Button type='submit' className='text-xl! p-2 my-4'>Submit</Button>
                    </FieldSet>
                </form>






            </div >
        </LocationContext.Provider>)
}

export default HomePage