import { useMap } from "react-leaflet";
import { useMemo, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import ClickHandler from "./ClickHandler";
import FitBounds from "./FitBounds";

import { origenIcon, destinoIcon, defaultIcon } from "./markerIcons";

const DEFAULT_CENTER = [1.61438, -75.60623]; // Florencia, Caquetá

export default function RouteMap({
  // ---------- Modo visualización ----------
  points = [],

  // ---------- Modo edición ----------
  editable = false,
  selecting = "origen",
  origen = null,
  destino = null,
  onSelect = null,

  // ---------- Configuración ----------
  height = "320px",
}) {
  /*
   * puntosMapa es la única lista que utilizará
   * el componente para dibujar TODO.
   *
   * Da igual si viene desde:
   *
   * - points
   * - origen/destino
   *
   * siempre terminaremos con el mismo formato:
   *
   * {
   *    lat,
   *    lng,
   *    label,
   *    icon
   * }
   */

  const puntosMapa = useMemo(() => {
    const resultado = [];

    // ==========================
    // MODO VISUALIZACIÓN
    // ==========================

    if (Array.isArray(points) && points.length > 0) {
      points.forEach((p) => {
        const lat = Number(p.lat);
        const lng = Number(p.lng);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          resultado.push({
            lat,

            lng,

            label: p.label ?? "",

            icon: defaultIcon,
          });
        }
      });
    }

    // ==========================
    // MODO EDICIÓN
    // ==========================
    else {
      if (
        origen &&
        Number.isFinite(Number(origen.lat)) &&
        Number.isFinite(Number(origen.lng))
      ) {
        resultado.push({
          lat: Number(origen.lat),

          lng: Number(origen.lng),

          label: "Origen",

          icon: origenIcon,
        });
      }

      if (
        destino &&
        Number.isFinite(Number(destino.lat)) &&
        Number.isFinite(Number(destino.lng))
      ) {
        resultado.push({
          lat: Number(destino.lat),

          lng: Number(destino.lng),

          label: "Destino",

          icon: destinoIcon,
        });
      }
    }

    return resultado;
  }, [points, origen, destino]);

  function MapController({ center, puntos }) {
    const map = useMap();

    useEffect(() => {
      if (puntos.length === 0) {
        map.setView(center, 12);
      } else if (puntos.length === 1) {
        map.setView([puntos[0].lat, puntos[0].lng], 14);
      } else {
        map.fitBounds(
          puntos.map((p) => [p.lat, p.lng]),
          { padding: [50, 50] },
        );
      }
    }, [map, center, puntos]);

    return null;
  }
  /*
   * Si no hay puntos,
   * mostramos Florencia.
   *
   * Si ya existen,
   * mostramos el primero.
   */

  const center =
    puntosMapa.length > 0
      ? [puntosMapa[0].lat, puntosMapa[0].lng]
      : DEFAULT_CENTER;

  return (
    <div
      style={{ height }}
      className="rounded-xl overflow-hidden border border-slate-700"
    >
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        scrollWheelZoom
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <MapController center={DEFAULT_CENTER} puntos={puntosMapa} />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ==========================
            Detectar clics
        ========================== */}

        <ClickHandler
          editable={editable}
          selecting={selecting}
          onSelect={onSelect}
        />

        {/* ==========================
            Zoom automático
        ========================== */}

        <FitBounds points={puntosMapa} />

        {/* ==========================
            Marcadores
        ========================== */}

        {puntosMapa.map((punto, index) => (
          <Marker
            key={index}
            position={[punto.lat, punto.lng]}
            icon={punto.icon}
          >
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold">{punto.label}</div>

                <div className="text-xs">Lat: {punto.lat.toFixed(6)}</div>

                <div className="text-xs">Lng: {punto.lng.toFixed(6)}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* ==========================
            Línea entre puntos
        ========================== */}

        {puntosMapa.length >= 2 && (
          <Polyline
            positions={puntosMapa.map((p) => [p.lat, p.lng])}
            pathOptions={{
              color: "#2563eb",
              weight: 4,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
