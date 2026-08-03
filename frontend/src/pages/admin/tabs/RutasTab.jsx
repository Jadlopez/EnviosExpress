import React, { useEffect, useMemo, useState } from "react";
import { PlusCircle, Map } from "lucide-react";
import apiClient from "../../../api/client";
import RouteMap from "../components/rutas/RouteMap";

export default function RutasTab() {
  const [rutas, setRutas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevaRuta, setNuevaRuta] = useState({
    origen: "",
    destino: "",
    paradas: "",
    origenLat: "",
    origenLng: "",
    destinoLat: "",
    destinoLng: "",
    costoEstimado: "",
  });
  const [asignaciones, setAsignaciones] = useState({});
  const [rutaMapaAbierta, setRutaMapaAbierta] = useState(null);
  const [seleccionando, setSeleccionando] = useState("origen");

  const distancia = useMemo(() => {
    if (
      !nuevaRuta.origenLat ||
      !nuevaRuta.origenLng ||
      !nuevaRuta.destinoLat ||
      !nuevaRuta.destinoLng
    ) {
      return null;
    }

    const lat1 = Number(nuevaRuta.origenLat);
    const lon1 = Number(nuevaRuta.origenLng);

    const lat2 = Number(nuevaRuta.destinoLat);
    const lon2 = Number(nuevaRuta.destinoLng);

    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c).toFixed(2);
  }, [
    nuevaRuta.origenLat,
    nuevaRuta.origenLng,
    nuevaRuta.destinoLat,
    nuevaRuta.destinoLng,
  ]);

  useEffect(() => {
    fetchRutas();
    fetchVehiculos();
    fetchConductores();
  }, []);

  const fetchRutas = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/rutas");
      setRutas(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehiculos = async () => {
    try {
      const res = await apiClient.get("/vehiculos");
      setVehiculos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConductores = async () => {
    try {
      const res = await apiClient.get("/conductores");
      setConductores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRuta = async (e) => {
    e.preventDefault();
    try {
      const aNumeroONulo = (valor) => (valor === "" ? null : Number(valor));
      await apiClient.post("/rutas", {
        origen: nuevaRuta.origen,
        destino: nuevaRuta.destino,
        paradas: nuevaRuta.paradas,
        origenLat: aNumeroONulo(nuevaRuta.origenLat),
        origenLng: aNumeroONulo(nuevaRuta.origenLng),
        destinoLat: aNumeroONulo(nuevaRuta.destinoLat),
        destinoLng: aNumeroONulo(nuevaRuta.destinoLng),
        costoEstimado: aNumeroONulo(nuevaRuta.costoEstimado),
      });
      setNuevaRuta({
        origen: "",
        destino: "",
        paradas: "",
        origenLat: "",
        origenLng: "",
        destinoLat: "",
        destinoLng: "",
        costoEstimado: "",
      });
      fetchRutas();
      alert("Ruta creada exitosamente.");
    } catch (err) {
      console.error(err);
      alert("Error al crear la ruta.");
    }
  };

  const handleAsignarRuta = async (rutaId) => {
    const seleccion = asignaciones[rutaId];
    if (!seleccion?.vehiculoId || !seleccion?.conductorId) {
      alert("Selecciona un vehículo y un conductor antes de asignar.");
      return;
    }
    try {
      await apiClient.put(`/rutas/${rutaId}/asignar`, {
        vehiculoId: seleccion.vehiculoId,
        conductorId: seleccion.conductorId,
      });
      fetchRutas();
      alert("Ruta asignada exitosamente.");
    } catch (err) {
      console.error(err);
      alert("Error al asignar la ruta.");
    }
  };

  const handleFinalizarRuta = async (rutaId) => {
    try {
      await apiClient.put(`/rutas/${rutaId}/finalizar`);
      fetchRutas();
      fetchVehiculos();
      fetchConductores();
    } catch (err) {
      console.error(err);
      alert("Error al finalizar la ruta.");
    }
  };

  const handleCancelarRuta = async (rutaId) => {
    if (
      !window.confirm("¿Cancelar esta ruta? Esta acción no se puede deshacer.")
    )
      return;
    try {
      await apiClient.put(`/rutas/${rutaId}/cancelar`);
      fetchRutas();
      fetchVehiculos();
      fetchConductores();
    } catch (err) {
      console.error(err);
      alert("Error al cancelar la ruta.");
    }
  };

  const formularioCompleto =
    nuevaRuta.origen &&
    nuevaRuta.destino &&
    nuevaRuta.origenLat &&
    nuevaRuta.origenLng &&
    nuevaRuta.destinoLat &&
    nuevaRuta.destinoLng;

  return (
    <div className="space-y-8">
      {/* ============================================= */}
      {/* CREACIÓN DE RUTA */}
      {/* ============================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ================= MAPA ================= */}

        <div className="xl:col-span-2">
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-4">
            <h2 className="text-xl font-semibold mb-4">Nueva Ruta</h2>

            <RouteMap
              editable
              selecting={seleccionando}
              origen={{
                lat: nuevaRuta.origenLat,
                lng: nuevaRuta.origenLng,
              }}
              destino={{
                lat: nuevaRuta.destinoLat,
                lng: nuevaRuta.destinoLng,
              }}
              onSelect={(lat, lng, tipo) => {
                if (tipo === "origen") {
                  setNuevaRuta((prev) => ({
                    ...prev,
                    origenLat: lat,
                    origenLng: lng,
                  }));

                  setSeleccionando("destino");
                } else {
                  setNuevaRuta((prev) => ({
                    ...prev,
                    destinoLat: lat,
                    destinoLng: lng,
                  }));
                }
              }}
              height="550px"
            />
          </div>
        </div>

        {/* ================= PANEL ================= */}

        <div>
          <div className="bg-slate-900 rounded-xl border border-slate-700 p-5 space-y-5">
            <h2 className="text-lg font-semibold">Información</h2>

            <div>
              <label className="block text-sm mb-1">Origen</label>

              <input
                className="w-full rounded-lg bg-slate-800 border border-slate-700 p-2"
                value={nuevaRuta.origen}
                onChange={(e) =>
                  setNuevaRuta((prev) => ({
                    ...prev,
                    origen: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Destino</label>

              <input
                className="w-full rounded-lg bg-slate-800 border border-slate-700 p-2"
                value={nuevaRuta.destino}
                onChange={(e) =>
                  setNuevaRuta((prev) => ({
                    ...prev,
                    destino: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Paradas</label>

              <textarea
                rows={3}
                className="w-full rounded-lg bg-slate-800 border border-slate-700 p-2"
                value={nuevaRuta.paradas}
                onChange={(e) =>
                  setNuevaRuta((prev) => ({
                    ...prev,
                    paradas: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Costo estimado</label>

              <input
                type="number"
                className="w-full rounded-lg bg-slate-800 border border-slate-700 p-2"
                value={nuevaRuta.costoEstimado}
                onChange={(e) =>
                  setNuevaRuta((prev) => ({
                    ...prev,
                    costoEstimado: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`rounded-lg p-2 transition ${
                  seleccionando === "origen" ? "bg-blue-600" : "bg-slate-700"
                }`}
                onClick={() => setSeleccionando("origen")}
              >
                Seleccionar origen
              </button>

              <button
                type="button"
                className={`rounded-lg p-2 transition ${
                  seleccionando === "destino" ? "bg-blue-600" : "bg-slate-700"
                }`}
                onClick={() => setSeleccionando("destino")}
              >
                Seleccionar destino
              </button>
            </div>

            <div className="border-t border-slate-700 pt-4 space-y-3">
              <div>
                <strong>Origen</strong>

                <div className="text-sm">
                  Lat: {nuevaRuta.origenLat || "--"}
                </div>

                <div className="text-sm">
                  Lng: {nuevaRuta.origenLng || "--"}
                </div>
              </div>

              <div>
                <strong>Destino</strong>

                <div className="text-sm">
                  Lat: {nuevaRuta.destinoLat || "--"}
                </div>

                <div className="text-sm">
                  Lng: {nuevaRuta.destinoLng || "--"}
                </div>
              </div>

              <div>
                <strong>Distancia</strong>

                <div>{distancia ? `${distancia} km` : "--"}</div>
              </div>
            </div>

            <button
              onClick={handleCreateRuta}
              disabled={!formularioCompleto}
              className={`w-full rounded-lg p-3 transition ${
                formularioCompleto
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-slate-700 cursor-not-allowed"
              }`}
            >
              Crear Ruta
            </button>
          </div>
        </div>
      </div>

      {/* AQUÍ DEBE CONTINUAR TU LISTADO ORIGINAL */}

      {/* Listado de rutas con asignación de vehículo/conductor */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700 font-semibold text-sm">
          Rutas Registradas
        </div>
        {loading ? (
          <div className="p-6 text-center text-slate-500 text-sm">
            Cargando...
          </div>
        ) : rutas.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">
            No hay rutas registradas.
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {rutas.map((r) => (
              <div key={r.id} className="p-4 flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="font-bold text-blue-400">
                      {r.origen} → {r.destino}
                    </span>
                    {r.paradas && (
                      <p className="text-slate-300 text-xs mt-0.5">
                        Paradas: {r.paradas}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        r.estado === "FINALIZADA"
                          ? "bg-emerald-600/20 text-emerald-300"
                          : r.estado === "CANCELADA"
                            ? "bg-red-600/20 text-red-300"
                            : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {r.estado || "PENDIENTE"}
                    </span>
                    <button
                      onClick={() =>
                        setRutaMapaAbierta(
                          rutaMapaAbierta === r.id ? null : r.id,
                        )
                      }
                      className="p-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                      title="Ver en mapa"
                    >
                      <Map className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {rutaMapaAbierta === r.id && (
                  // <RouteMap
                  //   points={[
                  //     {
                  //       lat: r.origenLat,
                  //       lng: r.origenLng,
                  //       label: `Origen: ${r.origen}`,
                  //     },
                  //     {
                  //       lat: r.destinoLat,
                  //       lng: r.destinoLng,
                  //       label: `Destino: ${r.destino}`,
                  //     },
                  //   ]}
                  //   height="260px"
                  // />
                  <></>
                )}

                {r.vehiculo && r.conductor && (
                  <p className="text-xs text-emerald-300">
                    Asignada a {r.vehiculo.placa} — Conductor:{" "}
                    {r.conductor.nombre}
                  </p>
                )}

                {r.estado === "PENDIENTE" && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                      value={asignaciones[r.id]?.vehiculoId || ""}
                      onChange={(e) =>
                        setAsignaciones({
                          ...asignaciones,
                          [r.id]: {
                            ...asignaciones[r.id],
                            vehiculoId: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="">Seleccionar vehículo</option>
                      {vehiculos
                        .filter((v) => v.disponible)
                        .map((v, idx) => (
                          <option key={idx} value={v.id}>
                            {v.placa} - {v.modelo}
                          </option>
                        ))}
                    </select>
                    <select
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                      value={asignaciones[r.id]?.conductorId || ""}
                      onChange={(e) =>
                        setAsignaciones({
                          ...asignaciones,
                          [r.id]: {
                            ...asignaciones[r.id],
                            conductorId: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="">Seleccionar conductor</option>
                      {conductores
                        .filter((c) => c.disponible)
                        .map((c, idx) => (
                          <option key={idx} value={c.id}>
                            {c.nombre}
                          </option>
                        ))}
                    </select>
                    <button
                      onClick={() => handleAsignarRuta(r.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors whitespace-nowrap"
                    >
                      Asignar
                    </button>
                  </div>
                )}

                {(r.estado === "PENDIENTE" || r.estado === "ASIGNADA") && (
                  <div className="flex gap-2 pt-1">
                    {r.estado === "ASIGNADA" && (
                      <button
                        onClick={() => handleFinalizarRuta(r.id)}
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Finalizar
                      </button>
                    )}
                    <button
                      onClick={() => handleCancelarRuta(r.id)}
                      className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
