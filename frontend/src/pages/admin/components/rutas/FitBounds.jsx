import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function FitBounds({ points = [] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length < 2) return;

    const validPoints = points.filter(
      (p) => Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng)),
    );

    if (validPoints.length < 2) return;

    const bounds = L.latLngBounds(
      validPoints.map((p) => [Number(p.lat), Number(p.lng)]),
    );

    map.fitBounds(bounds, {
      padding: [50, 50],
      animate: true,
    });
  }, [points, map]);

  return null;
}
