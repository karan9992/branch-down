'use client'
import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Map = dynamic(() => import('@/app/components/Map'), {
    ssr: false,
});
const HomePage = () => {


    interface Coordinates {
        latitude: number;
        longitude: number;
    }


    const [coords, setCoords] = useState<Coordinates | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

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

    return (
        <div className='min-h-screen border flex flex-col items-center justify-center '>

            <form className='border shadow-xl shadow-neutral-900 px-16 p-6 rounded-2xl  w-full max-w-md h-full flex flex-col justify-around  items-center gap-6'>


                <FieldSet className='  w-full '>
                    <FieldLegend className='text-3xl! text-center'>Report Fallen Tree</FieldLegend>
                    {/* <FieldDescription>Please enter details</FieldDescription> */}
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Full name</FieldLabel>
                            <Input id="name" autoComplete="off" className='text-2xl' />
                            {/* <FieldDescription>This appears on invoices and emails.</FieldDescription> */}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="title">Title</FieldLabel>
                            <Input id="title" autoComplete="off" />
                            {/* <FieldError>Choose another username.</FieldError> */}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="description">Description</FieldLabel>
                            <Textarea id="description" autoComplete="off" />
                            <FieldDescription>Describe the incident.</FieldDescription>
                        </Field>
                    </FieldGroup>



                    {/* <FieldLegend>Address Information</FieldLegend>
                    <FieldDescription>
                        We need your address to deliver your order.
                    </FieldDescription> */}
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="street">Street Address</FieldLabel>
                            <Input id="street" type="text" placeholder="123 Main St" />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="landmark">Landmark</FieldLabel>
                                <Input id="landmark" type="text" placeholder="Near Petrol pump" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="zip">Postal Code</FieldLabel>
                                <Input id="zip" type="text" placeholder="400032" />
                            </Field>
                        </div>
                    </FieldGroup>

                    <Map />
                </FieldSet>




                {/* <div className="p-4 border rounded-lg max-w-sm m-4">
                    <Button
                        onClick={handleGetLocation}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
                    >
                        {loading ? 'Locating...' : 'Get My Location'}
                    </Button>

                    {coords && (
                        <div className="mt-4 text-sm">
                            <p><strong>Latitude:</strong> {coords.latitude}</p>
                            <p><strong>Longitude:</strong> {coords.longitude}</p>
                        </div>
                    )}

                    {error && (
                        <p className="mt-4 text-sm text-red-500">Error: {error}</p>
                    )}
                </div> */}



            </form>





        </div>
    )
}

export default HomePage