"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const KitchenIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const AgentIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3716/3716297.png",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
});

interface DeliveryMapProps {
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
    currentLocation?: { lat: number; lng: number };
}

// Component to handle map centering and bounds
function MapController({ origin, destination, currentLocation }: DeliveryMapProps) {
    const map = useMap();

    useEffect(() => {
        if (!origin || !destination) return;

        const bounds = L.latLngBounds([
            [origin.lat, origin.lng],
            [destination.lat, destination.lng]
        ]);

        if (currentLocation) {
            bounds.extend([currentLocation.lat, currentLocation.lng]);
        }

        map.fitBounds(bounds, { padding: [50, 50] });
    }, [origin, destination, currentLocation, map]);

    return null;
}

export default function DeliveryMap({ origin, destination, currentLocation }: DeliveryMapProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-full w-full bg-slate-100 dark:bg-zinc-950 animate-pulse" />;

    return (
        <div className="h-full w-full relative z-0">
            <MapContainer
                center={[origin.lat, origin.lng]}
                zoom={14}
                scrollWheelZoom={false}
                className="h-full w-full"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController origin={origin} destination={destination} currentLocation={currentLocation} />

                <Marker position={[origin.lat, origin.lng]} icon={KitchenIcon} />
                <Marker position={[destination.lat, destination.lng]} icon={DefaultIcon} />

                {currentLocation && (
                    <Marker position={[currentLocation.lat, currentLocation.lng]} icon={AgentIcon} />
                )}

                <Polyline
                    positions={[
                        [origin.lat, origin.lng],
                        currentLocation ? [currentLocation.lat, currentLocation.lng] : [destination.lat, destination.lng],
                        [destination.lat, destination.lng]
                    ]}
                    color="#f97316"
                    weight={4}
                    dashArray="10, 10"
                    opacity={0.6}
                />
            </MapContainer>

            {/* Custom UI Overlays can go here */}
            <div className="absolute top-4 right-4 z-[1000] bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-100 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest">
                Safe Delivery Mode Active
            </div>
        </div>
    );
}
