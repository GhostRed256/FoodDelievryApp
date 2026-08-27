"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search, MapPin, Loader2, Target } from "lucide-react";

// Fix for default marker icons in Leaflet with Next.js
const customIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Tinsukia Default Center
const TINSUKIA_CENTER = { lat: 27.4922, lng: 95.3468 };

// Component to handle map clicks and moving the marker
function LocationMarker({ position, setPosition, setAddress, setIsLocating }: any) {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom(), { animate: true });
        }
    }, [position, map]);

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition({ lat, lng });
            reverseGeocode(lat, lng, setAddress, setIsLocating);
        },
    });

    return position ? <Marker position={position} icon={customIcon} /> : null;
}

// Function to get address from lat/lng
async function reverseGeocode(lat: number, lng: number, setAddress: (a: string) => void, setIsLocating: (b: boolean) => void) {
    setIsLocating(true);
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
        const data = await res.json();
        if (data && data.display_name) {
            setAddress(data.display_name);
        } else {
            setAddress("Unknown Location Selected");
        }
    } catch (err) {
        console.error("Geocoding failed", err);
        setAddress("Failed to get address name");
    } finally {
        setIsLocating(false);
    }
}

export default function LocationPicker({ onConfirm, onCancel }: { onConfirm: (location: { lat: number, lng: number, address: string }) => void, onCancel: () => void }) {
    const [position, setPosition] = useState<{ lat: number, lng: number }>(TINSUKIA_CENTER);
    const [address, setAddress] = useState<string>("Tinsukia, Assam");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    // Initial Geocode for default center
    useEffect(() => {
        reverseGeocode(position.lat, position.lng, setAddress, setIsLocating);
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            // Append Tinsukia to prioritize local results if not already present
            const q = searchQuery.toLowerCase().includes("tinsukia") ? searchQuery : `${searchQuery}, Tinsukia`;
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5`);
            const data = await res.json();
            setSearchResults(data);
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setIsSearching(false);
        }
    };

    const selectSearchResult = (result: any) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setPosition({ lat, lng });
        setAddress(result.display_name);
        setSearchResults([]);
        setSearchQuery("");
    };

    const getGPSLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition({ lat: latitude, lng: longitude });
                reverseGeocode(latitude, longitude, setAddress, setIsLocating);
            },
            (err) => {
                console.warn(err);
                setIsLocating(false);
                alert("Please enable GPS to use this feature.");
            }
        );
    };

    return (
        <div className="flex flex-col h-[500px] w-full bg-[#0c120c] rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl relative">
            
            {/* Top Search Bar Overlay */}
            <div className="absolute top-2 left-2 right-2 z-[1000] space-y-2">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                        <input 
                            type="text" 
                            placeholder="Search location (e.g. Makum Road)..." 
                            className="w-full pl-9 pr-4 py-3 rounded-xl bg-black/80 backdrop-blur-md border border-amber-500/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        type="button" 
                        onClick={getGPSLocation}
                        className="bg-amber-500 text-black p-3 rounded-xl shadow-lg hover:bg-amber-400 active:scale-95 transition-transform shrink-0"
                    >
                        <Target className="h-5 w-5" />
                    </button>
                </form>

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                    <div className="bg-black/90 backdrop-blur-xl border border-amber-500/30 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                        {searchResults.map((res, i) => (
                            <button 
                                key={i}
                                type="button"
                                onClick={() => selectSearchResult(res)}
                                className="w-full text-left px-4 py-3 border-b border-zinc-800 hover:bg-zinc-800/50 text-xs text-zinc-200 transition-colors"
                            >
                                {res.display_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* The Map */}
            <div className="flex-1 w-full z-0 relative bg-zinc-900">
                <MapContainer center={position} zoom={15} zoomControl={false} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    <LocationMarker position={position} setPosition={setPosition} setAddress={setAddress} setIsLocating={setIsLocating} />
                </MapContainer>
            </div>

            {/* Bottom Confirmation Bar */}
            <div className="p-4 bg-[#0c120c] border-t border-amber-500/30 z-[1000] flex flex-col gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
                <div className="flex items-start gap-2">
                    {isLocating ? <Loader2 className="h-4 w-4 animate-spin text-amber-500 shrink-0 mt-0.5" /> : <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />}
                    <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                        {address}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={onCancel}
                        className="px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-xs hover:bg-zinc-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => onConfirm({ ...position, address })}
                        className="flex-1 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-black py-3 rounded-xl shadow-lg active:scale-95 transition-transform"
                    >
                        Confirm Delivery Location
                    </button>
                </div>
            </div>
        </div>
    );
}
