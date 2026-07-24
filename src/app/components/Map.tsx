"use client";
import L from "leaflet";
import { useCallback, useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { IReport } from "@/types/report";
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

interface MapProps {
  height?: string;
  reportData?: IReport[];
}

export default function ReportMap({
  height = "200px",
  reportData = [],
}: MapProps) {
  const [position, setPosition] = useState<MapPosition | null>(null);
  const [reports, setReports] = useState<IReport[]>(reportData);

  useEffect(() => {
    setReports(reportData);
  }, [reportData]);

  const handlePositionChange = useCallback((newPosition: MapPosition) => {
    setPosition(newPosition);
  }, []);

  return (
    <MapContainer
      center={[19.068, 73.002]}
      zoom={13}
      style={{ height: height, width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        //   url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" //satellite
      />

      {reports?.map((report) => (
        <Marker
          key={report._id}
          position={[
            report.location.coordinates[1],
            report.location.coordinates[0],
          ]}
          icon={treeIcon}
        >
          <Popup>{report.title}</Popup>
        </Marker>
      ))}
      {position && (
        <Marker
          position={position}
          icon={locationIcon}
          title="You are here"
          riseOnHover
        >
          <Popup>You are here</Popup>
        </Marker>
      )}
      <UserLocation onPositionChange={handlePositionChange} />
    </MapContainer>
  );
}
