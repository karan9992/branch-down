"use client";

import { useContext, useEffect } from "react";
import { useMap } from "react-leaflet";
import { LocationContext } from "@/app/home/page"

export type MapPosition = [number, number];

interface UserLocationProps {
    onPositionChange: (position: MapPosition) => void;
}

function UserLocation({ onPositionChange }: UserLocationProps) {
    const map = useMap();
    const loc = useContext(LocationContext);
    useEffect(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
            const coords: MapPosition = [
                pos.coords.latitude,
                pos.coords.longitude,
            ];

            onPositionChange(coords);
            map.flyTo(coords, 16);
            console.log(coords)
            loc?.setCoords(pos.coords)
           
        });
    }, [map, onPositionChange]);

    return null;
}


export default UserLocation;
