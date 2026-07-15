"use client";

import { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import locationPin from "location-pin.png"
import L from "leaflet"
function UserLocation() {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const map = useMap();




    const locationIcon = new L.Icon({
        iconUrl: "/location-pin.png",
        iconSize: [42, 42],
        iconAnchor: [21, 42],

    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            const coords: [number, number] = [
                pos.coords.latitude,
                pos.coords.longitude,
            ];

            setPosition(coords);
            map.flyTo(coords, 16);
        });
    }, [map]);

    if (!position) {
        
        alert("Error getting location")
        return null;
    }
    return (
        <Marker position={position} icon={locationIcon} title="You are here" riseOnHover={true} >
            <Popup>You are here</Popup>
        </Marker>
    );
}

export default UserLocation;