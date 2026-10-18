'use client'

import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

interface MapProps {
  pickupCoords?: [number, number]
  dropoffCoords?: [number, number]
  pickupName?: string
  dropoffName?: string
}

export default function MapComponent({
  pickupCoords = [19.8762, 75.3433], // Default: Chhatrapati Sambhajinagar
  dropoffCoords,
  pickupName = 'Pickup Location',
  dropoffName = 'Dropoff Location',
}: MapProps) {
  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-white">
      <MapContainer
        center={pickupCoords}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
        style={{ background: '#ffffff' }}
      >
        {/* CartoDB Positron Clean White / Light Theme Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Pickup Marker */}
        <Marker position={pickupCoords} icon={defaultIcon}>
          <Popup>
            <span className="font-bold text-black">🚗 {pickupName}</span>
          </Popup>
        </Marker>

        {/* Dropoff Marker if available */}
        {dropoffCoords && (
          <Marker position={dropoffCoords} icon={defaultIcon}>
            <Popup>
              <span className="font-bold text-black">🏁 {dropoffName}</span>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}
