import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import { MapPin, Navigation, Star, ArrowRight } from 'lucide-react';

// Custom SVG icon generator for Leaflet
const createCustomPin = (number = null, isStart = false) => {
  const bgColor = isStart ? '#0284c7' : '#059669';
  const label = isStart ? 'Start' : number !== null ? `${number}` : '•';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${bgColor};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <span style="
          transform: rotate(45deg);
          font-weight: 800;
          font-size: ${isStart ? '10px' : '12px'};
          font-family: sans-serif;
        ">${label}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Component to dynamically fit map bounds to markers
function MapBoundsUpdater({ coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (coordinates && coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [coordinates, map]);

  return null;
}

export default function InteractiveMap({
  destinations = [],
  startLocation = null,
  showRoute = false,
  height = '31.25rem',
}) {
  // Center of Sri Lanka
  const defaultCenter = [7.8731, 80.7718];
  const activeCoords = useMemo(() => {
    const coords = [];
    if (startLocation?.latitude && startLocation?.longitude) {
      coords.push([startLocation.latitude, startLocation.longitude]);
    }
    destinations.forEach((d) => {
      const lat = d.location?.latitude || d.latitude;
      const lng = d.location?.longitude || d.longitude;
      if (lat && lng) coords.push([lat, lng]);
    });
    return coords;
  }, [destinations, startLocation]);

  const routePolylineCoords = [];
  if (showRoute) {
    if (startLocation?.latitude && startLocation?.longitude) {
      routePolylineCoords.push([startLocation.latitude, startLocation.longitude]);
    }
    destinations.forEach((d) => {
      const lat = d.location?.latitude || d.latitude;
      const lng = d.location?.longitude || d.longitude;
      if (lat && lng) routePolylineCoords.push([lat, lng]);
    });
  }

  return (
    <div style={{ height }} className="w-full min-h-64 max-h-[70svh] rounded-2xl overflow-hidden shadow-soft border border-slate-200 relative">
      <MapContainer
        center={defaultCenter}
        zoom={8}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Auto fit bounds */}
        {activeCoords.length > 0 && <MapBoundsUpdater coordinates={activeCoords} />}

        {/* Start Point Marker */}
        {startLocation?.latitude && startLocation?.longitude && (
          <Marker
            position={[startLocation.latitude, startLocation.longitude]}
            icon={createCustomPin(null, true)}
          >
            <Popup>
              <div className="p-3">
                <span className="text-xs font-bold text-ocean-600 uppercase tracking-wider block">
                  Starting Departure Point
                </span>
                <h4 className="font-bold text-slate-800 text-sm sm:text-base">{startLocation.name}</h4>
                <p className="text-xs text-slate-500 mt-1 sm:text-sm">
                  GPS: {startLocation.latitude.toFixed(4)}, {startLocation.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Itinerary Route Line */}
        {showRoute && routePolylineCoords.length > 1 && (
          <Polyline
            positions={routePolylineCoords}
            pathOptions={{
              color: '#059669',
              weight: 4,
              dashArray: '6, 8',
              opacity: 0.85,
            }}
          />
        )}

        {/* Destination Markers */}
        {destinations.map((dest, idx) => {
          const lat = dest.location?.latitude || dest.latitude;
          const lng = dest.location?.longitude || dest.longitude;
          if (!lat || !lng) return null;

          const image = dest.images?.[0] || dest.image;
          const cost = dest.estimatedDailyCost || dest.dailyCost;

          return (
            <Marker
              key={dest._id || dest.destinationId || idx}
              position={[lat, lng]}
              icon={createCustomPin(showRoute ? idx + 1 : null, false)}
            >
              <Popup>
                <div className="w-56 overflow-hidden rounded-lg">
                  {image && (
                    <img
                      src={image}
                      alt={dest.name}
                      className="w-full h-28 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-3">
                    {showRoute && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1 sm:text-sm">
                        Day {idx + 1} Stop
                      </span>
                    )}
                    <h4 className="font-bold text-slate-900 leading-tight text-sm sm:text-base">
                      {dest.name}
                    </h4>

                    {dest.province && (
                      <span className="text-xs text-slate-500 block mb-1 sm:text-sm">
                        {dest.province} Province
                      </span>
                    )}

                    <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-100 sm:text-sm">
                      {dest.averageRating && (
                        <div className="flex items-center gap-1 font-bold text-slate-700">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{dest.averageRating}</span>
                        </div>
                      )}

                      {cost && (
                        <span className="font-bold text-emerald-700">
                          {formatCurrency(cost)}
                        </span>
                      )}
                    </div>

                    {(dest.slug || dest._id) && (
                      <Link
                        to={`/destinations/${dest.slug || dest._id}`}
                        className="mt-2.5 w-full flex items-center justify-center gap-1 text-center py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition sm:text-sm"
                      >
                        View Details
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
