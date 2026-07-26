import React, { useState, useEffect } from 'react';
import { PlusCircle, Map } from 'lucide-react';
import apiClient from '../../../api/client';
import RouteMap from '../../../components/RouteMap';

export default function RutasTab() {
  const [rutas, setRutas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevaRuta, setNuevaRuta] = useState({ origen: '', destino: '', paradas: '' });
  const [asignaciones, setAsignaciones] = useState({});
  const [rutaMapaAbierta, setRutaMapaAbierta] = useState(null);

  useEffect(() => {
    fetchRutas();
    fetchVehiculos();
    fetchConductores();
  }, []);

  const fetchRutas = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/rutas');
      setRutas(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehiculos = async () => {
    try {
      const res = await apiClient.get('/vehiculos');
      setVehiculos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConductores = async () => {
    try {
      const res = await apiClient.get('/conductores');
      setConductores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRuta = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/rutas', nuevaRuta);
      setNuevaRuta({ origen: '', destino: '', paradas: '' });
      fetchRutas();
      alert('Ruta creada exitosamente.');
    } catch (err) {
      console.error(err);
      alert('Error al crear la ruta.');
    }
  };

  const handleAsignarRuta = async (rutaId) => {
    const seleccion = asignaciones[rutaId];
    if (!seleccion?.vehiculoId || !seleccion?.conductorId) {
      alert('Selecciona un vehículo y un conductor antes de asignar.');
      return;
    }
    try {
      await apiClient.put(`/rutas/${rutaId}/asignar`, {
        vehiculoId: seleccion.vehiculoId,
        conductorId: seleccion.conductorId,
      });
      fetchRutas();
      alert('Ruta asignada exitosamente.');
    } catch (err) {
      console.error(err);
      alert('Error al asignar la ruta.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gestión de Rutas</h2>
      </div>

      {/* Formulario para crear ruta */}
      <form onSubmit={handleCreateRuta} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Origen</label>
          <input
            type="text"
            required
            placeholder="Bodega Central"
            value={nuevaRuta.origen}
            onChange={(e) => setNuevaRuta({...nuevaRuta, origen: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Destino</label>
          <input
            type="text"
            required
            placeholder="Zona Norte"
            value={nuevaRuta.destino}
            onChange={(e) => setNuevaRuta({...nuevaRuta, destino: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Paradas</label>
          <input
            type="text"
            placeholder="Barrio A, Barrio B"
            value={nuevaRuta.paradas}
            onChange={(e) => setNuevaRuta({...nuevaRuta, paradas: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Crear Ruta</span>
        </button>
      </form>

      {/* Listado de rutas con asignación de vehículo/conductor */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700 font-semibold text-sm">Rutas Registradas</div>
        {loading ? (
          <div className="p-6 text-center text-slate-500 text-sm">Cargando...</div>
        ) : rutas.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">No hay rutas registradas.</div>
        ) : (
          <div className="divide-y divide-slate-700">
            {rutas.map((r) => (
              <div key={r.id} className="p-4 flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-start gap-3">
                  <div>
                    <span className="font-bold text-blue-400">{r.origen} → {r.destino}</span>
                    {r.paradas && <p className="text-slate-300 text-xs mt-0.5">Paradas: {r.paradas}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-medium">
                      {r.estado || 'PENDIENTE'}
                    </span>
                    <button
                      onClick={() => setRutaMapaAbierta(rutaMapaAbierta === r.id ? null : r.id)}
                      className="p-1.5 bg-slate-700/60 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                      title="Ver en mapa"
                    >
                      <Map className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {rutaMapaAbierta === r.id && (
                  <RouteMap
                    points={[
                      { lat: r.origenLat, lng: r.origenLng, label: `Origen: ${r.origen}` },
                      { lat: r.destinoLat, lng: r.destinoLng, label: `Destino: ${r.destino}` },
                    ]}
                    height="260px"
                  />
                )}

                {r.vehiculo && r.conductor ? (
                  <p className="text-xs text-emerald-300">
                    Asignada a {r.vehiculo.placa} — Conductor: {r.conductor.nombre}
                  </p>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                      value={asignaciones[r.id]?.vehiculoId || ''}
                      onChange={(e) => setAsignaciones({...asignaciones, [r.id]: {...asignaciones[r.id], vehiculoId: e.target.value}})}
                    >
                      <option value="">Seleccionar vehículo</option>
                      {vehiculos.filter((v) => v.disponible).map((v, idx) => (
                        <option key={idx} value={v.id}>{v.placa} - {v.modelo}</option>
                      ))}
                    </select>
                    <select
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                      value={asignaciones[r.id]?.conductorId || ''}
                      onChange={(e) => setAsignaciones({...asignaciones, [r.id]: {...asignaciones[r.id], conductorId: e.target.value}})}
                    >
                      <option value="">Seleccionar conductor</option>
                      {conductores.filter((c) => c.disponible).map((c, idx) => (
                        <option key={idx} value={c.id}>{c.nombre}</option>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
