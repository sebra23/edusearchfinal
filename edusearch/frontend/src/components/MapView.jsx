import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Center of USA coordinates
const DEFAULT_CENTER = [39.8283, -98.5795];
const DEFAULT_ZOOM = 4;

const createCustomIcon = (school, isHovered) => {
    // Determine mock grade based on rating
    const grade = school.rating_overall >= 4.5 ? 'A+' : (school.rating_overall >= 4.0 ? 'A' : 'A-');

    // Dynamic classes based on hover state
    const bgClass = isHovered ? 'bg-[#1a1a1a]' : 'bg-[#2a7a4f]';
    const borderClass = isHovered ? 'border-t-[#1a1a1a]' : 'border-t-[#2a7a4f]';
    const scaleClass = isHovered ? 'scale-125 -translate-y-2' : '';
    const zIndex = isHovered ? 'z-50' : 'z-10';

    return L.divIcon({
        className: `custom-marker ${isHovered ? 'leaflet-interactive leaflet-marker-draggable' : ''}`,
        html: `
            <div class="relative flex items-center transition-all duration-300 ${scaleClass}" style="z-index: ${isHovered ? 1000 : 1}">
                <div class="flex flex-col items-center relative ${zIndex} filter drop-shadow cursor-pointer transition-transform group">
                    <div class="${bgClass} text-white rounded-full w-7 h-7 flex items-center justify-center font-bold border-[1.5px] border-white text-[10px] shadow-sm transition-colors">
                        ${grade}
                    </div>
                    <div class="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-white -mt-[1px]"></div>
                    <div class="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[5px] ${borderClass} absolute bottom-[2px] transition-colors"></div>
                </div>
            </div>
        `,
        iconSize: [28, 35],
        iconAnchor: [14, 35],
        popupAnchor: [0, -35]
    });
};

function MapUpdater({ results }) {
    const map = useMap();

    React.useEffect(() => {
        if (results && results.length > 0) {
            // Find bounds of all markers
            let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
            let hasValidCoords = false;

            results.forEach(school => {
                if (school.latitude && school.longitude) {
                    hasValidCoords = true;
                    minLat = Math.min(minLat, school.latitude);
                    maxLat = Math.max(maxLat, school.latitude);
                    minLng = Math.min(minLng, school.longitude);
                    maxLng = Math.max(maxLng, school.longitude);
                }
            });

            if (hasValidCoords) {
                // Add some padding to bounds
                const latDiff = maxLat - minLat || 0.1;
                const lngDiff = maxLng - minLng || 0.1;

                const bounds = [
                    [minLat - latDiff * 0.1, minLng - lngDiff * 0.1],
                    [maxLat + latDiff * 0.1, maxLng + lngDiff * 0.1]
                ];
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 8 });
            }
        }
    }, [results, map]);

    return null;
}

export default function MapView({ results, total, onClose, hoveredSchoolId }) {
    return (
        <div className="w-full h-full relative bg-[#e5e3df]">
            {/* Top controls matching Niche map */}
            <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between gap-2 pointer-events-none">
                <button className="bg-white text-gray-800 px-4 py-2 rounded-full shadow hover:bg-gray-50 text-sm font-bold pointer-events-auto transition active:scale-95">
                    Redo search in this area
                </button>
            </div>

            <MapContainer
                center={DEFAULT_CENTER}
                zoom={DEFAULT_ZOOM}
                className="w-full h-full"
                zoomControl={false}
            >
                {/* Clean, pale tile layer similar to Niche's minimal map style */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />

                <MapUpdater results={results} />

                {results.map((school) => {
                    if (school.latitude && school.longitude) {
                        const isHovered = school.id === hoveredSchoolId;
                        return (
                            <Marker
                                key={school.id}
                                position={[school.latitude, school.longitude]}
                                icon={createCustomIcon(school, isHovered)}
                                zIndexOffset={isHovered ? 1000 : 0}
                            >
                                <Popup className="custom-popup">
                                    <div className="p-1 min-w-[200px]">
                                        <div className="text-[10px] text-green-600 font-bold tracking-widest uppercase mb-1">#{school.id % 100 + 1} Best College</div>
                                        <Link to={`/school/${school.slug}`} className="font-bold text-[#2a5b9c] text-sm hover:underline block mb-1">
                                            {school.name}
                                        </Link>
                                        <div className="text-xs text-gray-500 mb-2">{school.city}, {school.state}</div>
                                        <div className="flex justify-between items-center text-xs">
                                            <div className="flex gap-1 items-center font-bold text-gray-700">
                                                <div className="w-5 h-5 rounded-full bg-gray-600 text-white flex items-center justify-center text-[8px]">
                                                    {school.rating_overall >= 4.5 ? 'A+' : 'A'}
                                                </div>
                                                Niche Grade
                                            </div>
                                            <div className="text-gray-500">{school.enrollment_total?.toLocaleString()} students</div>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    }
                    return null;
                })}
            </MapContainer>

            {/* Pagination overlay at bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-full shadow-lg flex items-center h-10 px-1 border border-gray-200">
                <button className="p-2 text-gray-400 hover:text-black transition rounded-full hover:bg-gray-100 disabled:opacity-50" disabled><ChevronLeft className="w-4 h-4" /></button>
                <div className="px-3 text-xs whitespace-nowrap text-gray-800 font-bold">1 – {total > 0 ? 25 : 0} of {total.toLocaleString()} schools</div>
                <button className="p-2 text-gray-800 hover:text-black transition rounded-full hover:bg-gray-100"><ChevronRight className="w-4 h-4" /></button>
            </div>

            {/* Some minimal inline styling for Leaflet custom elements to avoid full CSS file edits */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .leaflet-popup-content-wrapper { border-radius: 8px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); }
                .leaflet-popup-content { margin: 8px; }
            `}} />
        </div>
    );
}
