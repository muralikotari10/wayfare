import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom Map Marker Icon
const createCustomIcon = (category = 'Sightseeing') => {
  const color =
    category === 'Food'
      ? '#f59e0b'
      : category === 'Hotel'
      ? '#8b5cf6'
      : category === 'Transport'
      ? '#3b82f6'
      : category === 'Activity'
      ? '#10b981'
      : '#06b6d4';

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid #ffffff;
        box-shadow: 0 0 12px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ffffff;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  });
};

const ChangeMapView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

export const MapView = ({ center = [35.6762, 139.6503], zoom = 12, markers = [], polylineCoords = [] }) => {
  const validMarkers = markers.filter((m) => m.lat && m.lng && m.lat !== 0 && m.lng !== 0);

  return (
    <div className="map-container-wrap">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <ChangeMapView center={center} zoom={zoom} />
        {/* Sleek Dark CartoDB Map Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Route Polyline */}
        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            color="#06b6d4"
            weight={4}
            opacity={0.8}
            dashArray="6, 8"
          />
        )}

        {/* Activity & Landmark Markers */}
        {validMarkers.map((marker, idx) => (
          <Marker
            key={marker.id || idx}
            position={[marker.lat, marker.lng]}
            icon={createCustomIcon(marker.category)}
          >
            <Popup>
              <div style={{ padding: '4px', minWidth: '160px' }}>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700 }}>
                  {marker.category || 'Location'}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', margin: '2px 0 4px 0', color: '#fff' }}>
                  {marker.title}
                </div>
                {marker.time && (
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>⏰ {marker.time}</div>
                )}
                {marker.cost > 0 && (
                  <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
                    💵 Est. ${marker.cost}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
