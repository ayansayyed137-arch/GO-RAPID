'use client'

import React, { useEffect } from 'react'
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
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-xl border border-gray-800">
      <MapContainer
        center={pickupCoords}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        {/* Clean White / Light Theme Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
