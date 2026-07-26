import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import apiClient from '../../../api/client';

export default function EncomiendasTab() {
  const [encomiendas, setEncomiendas] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevaEncomienda, setNuevaEncomienda] = useState({ codigoGuia: '', nombreDestinatario: '', direccionDestino: '' });
  const [asignaciones, setAsignaciones] = useState({});

  useEffect(() => {
    fetchEncomiendas();
    fetchConductores();
  }, []);

  const fetchEncomiendas = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/encomiendas');
      setEncomiendas(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  const handleCreateEncomienda = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/encomiendas', nuevaEncomienda);
      setNuevaEncomienda({ codigoGuia: '', nombreDestinatario: '', direccionDestino: '' });
      fetchEncomiendas();
      alert('Encomienda creada exitosamente.');
    } catch (err) {
      console.error(err);
      alert('Error al registrar la encomienda.');
    }
  };

  const handleAsignarConductor = async (encomiendaId) => {
    const conductorId = asignaciones[encomiendaId];
    if (!conductorId) {
      alert('Selecciona un conductor antes de asignar.');
      return;
    }
    try {
      await apiClient.put(`/encomiendas/${encomiendaId}/conductor`, { conductorId });
      fetchEncomiendas();
      alert('Conductor asignado exitosamente.');
    } catch (err) {
      console.error(err);
      alert('Error al asignar el conductor.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gestión de Encomiendas</h2>
      </div>

      {/* Formulario rápido para crear */}
      <form onSubmit={handleCreateEncomienda} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Código de Guía</label>
          <input
            type="text"
            required
            placeholder="GUA-001"
            value={nuevaEncomienda.codigoGuia}
            onChange={(e) => setNuevaEncomienda({...nuevaEncomienda, codigoGuia: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Destinatario</label>
          <input
            type="text"
            required
            placeholder="Nombre completo"
            value={nuevaEncomienda.nombreDestinatario}
            onChange={(e) => setNuevaEncomienda({...nuevaEncomienda, nombreDestinatario: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Dirección de Destino</label>
          <input
            type="text"
            required
            placeholder="Dirección exacta"
            value={nuevaEncomienda.direccionDestino}
            onChange={(e) => setNuevaEncomienda({...nuevaEncomienda, direccionDestino: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Registrar</span>
        </button>
      </form>

      {/* Listado de encomiendas */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700 font-semibold text-sm">Encomiendas Registradas</div>
        {loading ? (
          <div className="p-6 text-center text-slate-500 text-sm">Cargando...</div>
        ) : encomiendas.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">No hay encomiendas registradas.</div>
        ) : (
          <div className="divide-y divide-slate-700">
            {encomiendas.map((item) => (
              <div key={item.id} className="p-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-blue-400">{item.codigoGuia}</span>
                    <p className="text-slate-300 text-xs mt-0.5">Destinatario: {item.nombreDestinatario} ({item.direccionDestino})</p>
                  </div>
                  <span className="px-2.5 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-medium">
                    {item.estado || 'REGISTRADO'}
                  </span>
                </div>

                {item.conductor ? (
                  <p className="text-xs text-emerald-300">Conductor asignado: {item.conductor.nombre}</p>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                      value={asignaciones[item.id] || ''}
                      onChange={(e) => setAsignaciones({...asignaciones, [item.id]: e.target.value})}
                    >
                      <option value="">Seleccionar conductor</option>
                      {conductores.map((c, idx) => (
                        <option key={idx} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleAsignarConductor(item.id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors whitespace-nowrap"
                    >
                      Asignar conductor
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
