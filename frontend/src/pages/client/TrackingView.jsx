import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Package,
  AlertCircle,
  ArrowLeft,
  BellRing,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";
import RouteMap from "../admin/components/RouteMap";

const POLL_INTERVAL_MS = 8000;

export default function TrackingView() {
  const [codigoGuia, setCodigoGuia] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notificacion, setNotificacion] = useState("");
  const navigate = useNavigate();
  const codigoActivoRef = useRef("");
  const estadoAnteriorRef = useRef("");

  const consultarEstado = async (codigo, { silencioso } = {}) => {
    try {
      const response = await apiClient.get(`/trazabilidad/${codigo}`);
      const nuevoEstado = response.data.estado;

      if (
        silencioso &&
        estadoAnteriorRef.current &&
        nuevoEstado &&
        nuevoEstado !== estadoAnteriorRef.current
      ) {
        setNotificacion(
          `Tu encomienda cambió de estado: ahora está "${nuevoEstado}"`,
        );
      }
      estadoAnteriorRef.current = nuevoEstado;
      setResultado(response.data);
      return true;
    } catch (err) {
      console.error(err);
      if (!silencioso) {
        setError(
          "No se encontró ninguna encomienda con ese código de guía o hubo un error al consultar.",
        );
      }
      return false;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const codigo = codigoGuia.trim();
    if (!codigo) return;

    setError("");
    setLoading(true);
    setResultado(null);
    setNotificacion("");
    estadoAnteriorRef.current = "";

    const ok = await consultarEstado(codigo);
    codigoActivoRef.current = ok ? codigo : "";
    setLoading(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (codigoActivoRef.current) {
        consultarEstado(codigoActivoRef.current, { silencioso: true });
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      {/* Cabecera adaptada para móvil */}
      <header className="p-4 sm:p-6 border-b border-slate-800 flex justify-between items-center max-w-5xl mx-auto w-full sticky top-0 bg-slate-900/90 backdrop-blur z-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-1.5 text-slate-300 hover:text-white transition-colors text-sm font-medium py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Volver al Login</span>
          <span className="sm:hidden">Volver</span>
        </button>
        <h1 className="text-sm sm:text-base font-bold flex items-center space-x-2">
          <Package className="w-5 h-5 text-blue-500" />
          <span className="truncate max-w-[180px] sm:max-w-none">
            Envíos Express - Rastreo
          </span>
        </h1>
      </header>

      {/* Contenido principal flexible */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full flex-grow">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 sm:mb-3">
            Rastrea tu Encomienda
          </h2>
          <p className="text-slate-300 text-sm sm:text-base px-2">
            Ingresa el código de guía suministrado al momento de despachar tu
            paquete.
          </p>
        </div>

        {/* Buscador responsivo (se apila en vertical en celulares pequeños si es necesario) */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-grow">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={codigoGuia}
              onChange={(e) => setCodigoGuia(e.target.value)}
              placeholder="Ej. GUA-123456"
              className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl transition-colors text-sm sm:text-base flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg active:scale-95"
          >
            <span>{loading ? "Buscando..." : "Consultar"}</span>
          </button>
        </form>

        {/* Mensaje de Error */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl flex items-center space-x-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Notificación de cambio de estado (RF-11) */}
        {notificacion && (
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-xl flex items-center justify-between gap-3 text-sm font-medium">
            <span className="flex items-center space-x-3">
              <BellRing className="w-5 h-5 flex-shrink-0 text-blue-400" />
              <span>{notificacion}</span>
            </span>
            <button
              onClick={() => setNotificacion("")}
              className="text-blue-300 hover:text-white text-xs font-semibold"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Resultado de la Consulta */}
        {resultado && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-700 pb-4">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                  Código de Guía
                </span>
                <span className="text-lg sm:text-xl font-bold text-blue-400">
                  {resultado.codigoGuia || codigoGuia}
                </span>
              </div>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold tracking-wide">
                {resultado.estado || "En Tránsito"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  Destinatario
                </span>
                <span className="font-semibold text-white">
                  {resultado.nombreDestinatario || "No especificado"}
                </span>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">
                  Dirección de Destino
                </span>
                <span className="font-medium text-slate-200">
                  {resultado.direccionDestino || "No especificada"}
                </span>
              </div>
            </div>

            {resultado.latitud != null && resultado.longitud != null && (
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block mb-2">
                  Ubicación del Vehículo
                </span>
                <RouteMap
                  points={[
                    {
                      lat: resultado.latitud,
                      lng: resultado.longitud,
                      label: "Vehículo asignado",
                    },
                  ]}
                  height="260px"
                />
              </div>
            )}

            <div className="text-center pt-2">
              <p className="text-xs text-slate-400">
                Última actualización registrada por el sistema de despacho. El
                estado se actualiza automáticamente cada{" "}
                {POLL_INTERVAL_MS / 1000} segundos.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Pie de página */}
      <footer className="text-center py-6 text-slate-500 text-xs border-t border-slate-800 px-4">
        Envíos Express &copy; {new Date().getFullYear()} - Todos los derechos
        reservados.
      </footer>
    </div>
  );
}
