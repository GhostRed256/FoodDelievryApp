"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Marker icons
const DefaultIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const KitchenIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
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

    if (!mounted) return <div className="h-full w-full bg-[#0c120c] animate-pulse" />;

    return (
        <div className="h-full w-full relative z-0">
            <MapContainer
                center={[origin.lat, origin.lng]}
                zoom={14}
                scrollWheelZoom={false}
                className="h-full w-full"
                zoomControl={false}
            >
                {/* CartoDB Dark Matter or OpenStreetMap tile layer */}
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
                    color="#eab308"
                    weight={4}
                    dashArray="8, 8"
                    opacity={0.8}
                />
            </MapContainer>

            {/* Custom UI Overlays */}
            <div className="absolute top-4 right-4 z-[1000] bg-[#070a07]/90 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-xl border border-amber-500/30 text-[10px] font-black uppercase tracking-widest text-amber-400">
                Live GPS Telemetry Active
            </div>
        </div>
    );
}
