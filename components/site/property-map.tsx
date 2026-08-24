// components/site/property-map.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet no resuelve bien los íconos por defecto con bundlers modernos (Webpack/Turbopack) —
// hay que apuntarlos manualmente a los assets en /public.
const markerIcon = L.icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type PropertyMapProps = {
  properties: {
    id: string;
    title: string;
    price: number;
    latitude: number;
    longitude: number;
  }[];
  center?: [number, number];
  zoom?: number;
  focusedPropertyId?: string | null;
};

function FlyToFocused({
  properties,
  focusedPropertyId,
}: {
  properties: PropertyMapProps["properties"];
  focusedPropertyId?: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!focusedPropertyId) return;
    const target = properties.find((p) => p.id === focusedPropertyId);
    if (target) {
      map.flyTo([target.latitude, target.longitude], 12, { duration: 1 });
    }
  }, [focusedPropertyId, properties, map]);

  return null;
}

export function PropertyMap({ properties, center, zoom = 4, focusedPropertyId }: PropertyMapProps) {
  const defaultCenter: [number, number] = center ?? [20, 0];

  return (
       <MapContainer
      center={defaultCenter}
      zoom={zoom}
      scrollWheelZoom
      className="h-full w-full rounded-lg"
    >
      <FlyToFocused properties={properties} focusedPropertyId={focusedPropertyId} />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.latitude, property.longitude]}
          icon={markerIcon}
        >
          <Popup>
            <strong>{property.title}</strong>
            <br />
            <span className="font-mono">${property.price} / noche</span>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}