import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// points: [{ lat, lng, label }]
export default function RouteMap({ points, height = '320px' }) {
  const validPoints = points.filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number');

  if (validPoints.length === 0) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center bg-slate-900 border border-slate-700 rounded-xl text-slate-400 text-sm"
      >
        No hay coordenadas disponibles para mostrar en el mapa.
      </div>
    );
  }

  const center = [validPoints[0].lat, validPoints[0].lng];
  const line = validPoints.map((p) => [p.lat, p.lng]);

  return (
    <div style={{ height }} className="rounded-xl overflow-hidden border border-slate-700">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validPoints.map((p, idx) => (
          <Marker key={idx} position={[p.lat, p.lng]}>
            {p.label && <Popup>{p.label}</Popup>}
          </Marker>
        ))}
        {line.length > 1 && <Polyline positions={line} color="#3b82f6" />}
      </MapContainer>
    </div>
  );
}
