import React, { useState, useEffect } from 'react';
import { PlusCircle, Map } from 'lucide-react';
import apiClient from '../../../api/client';
import RouteMap from '../../../components/RouteMap';

export default function RutasTab() {
  const [rutas, setRutas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevaRuta, setNuevaRuta] = useState({
    origen: '', destino: '', paradas: '',
    origenLat: '', origenLng: '', destinoLat: '', destinoLng: '', costoEstimado: '',
  });
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
      const aNumeroONulo = (valor) => (valor === '' ? null : Number(valor));
      await apiClient.post('/rutas', {
        origen: nuevaRuta.origen,
        destino: nuevaRuta.destino,
        paradas: nuevaRuta.paradas,
        origenLat: aNumeroONulo(nuevaRuta.origenLat),
        origenLng: aNumeroONulo(nuevaRuta.origenLng),
        destinoLat: aNumeroONulo(nuevaRuta.destinoLat),
        destinoLng: aNumeroONulo(nuevaRuta.destinoLng),
        costoEstimado: aNumeroONulo(nuevaRuta.costoEstimado),
      });
      setNuevaRuta({ origen: '', destino: '', paradas: '', origenLat: '', origenLng: '', destinoLat: '', destinoLng: '', costoEstimado: '' });
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

  const handleFinalizarRuta = async (rutaId) => {
    try {
      await apiClient.put(`/rutas/${rutaId}/finalizar`);
      fetchRutas();
      fetchVehiculos();
      fetchConductores();
    } catch (err) {
      console.error(err);
      alert('Error al finalizar la ruta.');
    }
  };

  const handleCancelarRuta = async (rutaId) => {
    if (!window.confirm('¿Cancelar esta ruta? Esta acción no se puede deshacer.')) return;
    try {
      await apiClient.put(`/rutas/${rutaId}/cancelar`);
      fetchRutas();
      fetchVehiculos();
      fetchConductores();
    } catch (err) {
      console.error(err);
      alert('Error al cancelar la ruta.');
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

        <div className="md:col-span-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-400 mb-3">Datos opcionales — coordenadas para el mapa (RF-13) y costo estimado para reportes (RF-12)</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <input
              type="number" step="any" placeholder="Lat. origen"
              value={nuevaRuta.origenLat}
              onChange={(e) => setNuevaRuta({...nuevaRuta, origenLat: e.target.value})}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <input
              type="number" step="any" placeholder="Lng. origen"
              value={nuevaRuta.origenLng}
              onChange={(e) => setNuevaRuta({...nuevaRuta, origenLng: e.target.value})}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <input
              type="number" step="any" placeholder="Lat. destino"
              value={nuevaRuta.destinoLat}
              onChange={(e) => setNuevaRuta({...nuevaRuta, destinoLat: e.target.value})}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <input
              type="number" step="any" placeholder="Lng. destino"
              value={nuevaRuta.destinoLng}
              onChange={(e) => setNuevaRuta({...nuevaRuta, destinoLng: e.target.value})}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
            />
            <input
              type="number" step="any" placeholder="Costo estimado (COP)"
              value={nuevaRuta.costoEstimado}
              onChange={(e) => setNuevaRuta({...nuevaRuta, costoEstimado: e.target.value})}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
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
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      r.estado === 'FINALIZADA' ? 'bg-emerald-600/20 text-emerald-300' :
                      r.estado === 'CANCELADA' ? 'bg-red-600/20 text-red-300' :
                      'bg-slate-700 text-slate-300'
                    }`}>
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

                {r.vehiculo && r.conductor && (
                  <p className="text-xs text-emerald-300">
                    Asignada a {r.vehiculo.placa} — Conductor: {r.conductor.nombre}
                  </p>
                )}

                {r.estado === 'PENDIENTE' && (
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

                {(r.estado === 'PENDIENTE' || r.estado === 'ASIGNADA') && (
                  <div className="flex gap-2 pt-1">
                    {r.estado === 'ASIGNADA' && (
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
