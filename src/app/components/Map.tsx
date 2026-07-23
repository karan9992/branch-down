"use client";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents
} from "react-leaflet";
// import "./LeafletMarker";
import { useCallback, useState } from "react";
import L from "leaflet";
import UserLocation, { type MapPosition } from "./UserLocation";

const treeIcon = new L.Icon({
    iconUrl: "/axe.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],

});

const locationIcon = new L.Icon({
    iconUrl: "/location-pin.png",
    iconSize: [42, 42],
    iconAnchor: [21, 42],
});


function getAddress(lat: number, lon: number) {

    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

    fetch(url, {
        headers: {
            'User-Agent': 'BranchDown/1.0' // OpenStreetMap requires a custom User-Agent header
        }
    }).then(res => res.json())
        .then(data => {
            if (data.display_name) {
                console.log("Full Address:", data.display_name);
                return data.display_name;
            } else {
                console.log("No address found.");
            }
        })
        .catch(err => console.log(err))



}

export default function Map({height ='200px'}:{height?:string}) {
    const [position, setPosition] = useState<MapPosition | null>(null);
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

    const handlePositionChange = useCallback((newPosition: MapPosition) => {
        setPosition(newPosition);
    }, []);


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
            style={{ height: height, width: "100%" }}
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
            {position && (
                <Marker position={position} icon={locationIcon} title="You are here" riseOnHover>
                    <Popup>You are here</Popup>
                </Marker>
            )}
            <UserLocation onPositionChange={handlePositionChange} />
            <MapClick />

        </MapContainer>
    );
}
