"use client";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
} from "react-leaflet";
import "./LeafletMarker";
import { useMapEvents } from "react-leaflet";
import { useState } from "react";


export default function Map() {

    const [reports, setReports] = useState([
        {

            id: 0,
            lat: 19.16903,
            lng: 73.00136,
            title: "Pole Fallen",
        },
        {
            id: 1,
            lat: 19.076,
            lng: 72.8777,
            title: "Tree Fallen",
        },
        {
            id: 2,
            lat: 19.08,
            lng: 72.88,
            title: "Road Blocked",
        },
    ])


    function MapClick() {
        useMapEvents({
            click(e) {
                console.log(e.latlng);
            },
        });

        return null;
    }
    return (
        <MapContainer
            center={[19.076, 72.8777]}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {reports.map((report) => (
                <Marker
                    key={report.id}
                    position={[report.lat, report.lng]}
                >
                    <Popup>{report.title}</Popup>
                </Marker>
            ))}
            <MapClick />
        </MapContainer>
    );
}