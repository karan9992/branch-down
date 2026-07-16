"use client";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents
} from "react-leaflet";
// import "./LeafletMarker";
import { useState } from "react";
import L from "leaflet";
import UserLocation from "./UserLocation";

const treeIcon = new L.Icon({
    iconUrl: "/axe.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],

});

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
                // console.log(e.latlng);

                const ans = confirm("Do you want to report fallen tree?")
                if (ans) {
                    let newReprt = {
                        id: reports.length,
                        lat: Number(e.latlng.lat.toFixed(4)),
                        lng: Number(e.latlng.lng.toFixed(4)),
                        title: "Tree fallen"
                    }

                    const targetLocation = L.latLng(newReprt.lat, newReprt.lng)

                    const oldReport = reports.filter(loc => {
                        const locLatLng = L.latLng(loc.lat, loc.lng);

                        // Calculates actual distance in meters on the Earth's surface
                        const distance = targetLocation.distanceTo(locLatLng);
                        return distance <= 50  // 20 meter
                    })
                    if (oldReport.length > 0) {
                        alert("Incident already reported")
                    } else {
                        setReports(prev => [...prev, newReprt])

                    }
                    console.log(newReprt, oldReport)
                }
            },
        });

        return null;
    }
    return (
        <MapContainer
            center={[19.068, 73.002]}
            zoom={13}
            style={{ height: "200px", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            //   url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" //satellite

            />

            {reports.map((report) => (
                <Marker
                    key={report.id}
                    position={[report.lat, report.lng]}
                    icon={treeIcon}
                >
                    <Popup>{`${report.id} ${report.title}`}</Popup>
                </Marker>
            ))}
            <UserLocation />
            <MapClick />

        </MapContainer>
    );
}
