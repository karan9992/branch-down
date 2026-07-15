'use client'
import React, { useEffect, useState } from 'react'
import dynamic from "next/dynamic";
import { Button } from '@/components/ui/button';

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
        <div className='min-h-screen border flex flex-col items-center  '>

            <form className='border w-full max-w-2xl h-full flex flex-col justify-around  items-center gap-6'>
                <h1 className='text-5xl my-4'>Report Fallen Tree</h1>
                <div className="">
                    <label htmlFor="">Title</label>
                    <input type="text" name="" id="" className='border' />
                </div>

                <div className="">
                    <label htmlFor="">Desciption</label>
                    <input type="text" name="" id="" className='border' />
                </div>

                <Map />


                <div className="p-4 border rounded-lg max-w-sm m-4">
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
                </div>



            </form>





        </div>
    )
}

export default HomePage