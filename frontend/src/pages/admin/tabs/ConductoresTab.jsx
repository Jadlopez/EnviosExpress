import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import apiClient from '../../../api/client';

export default function ConductoresTab() {
  const [conductores, setConductores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevoConductor, setNuevoConductor] = useState({ nombre: '', documento: '', telefono: '', email: '' });

  useEffect(() => {
    fetchConductores();
  }, []);

  const fetchConductores = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/conductores');
      setConductores(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConductor = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/conductores', nuevoConductor);
      setNuevoConductor({ nombre: '', documento: '', telefono: '', email: '' });
      fetchConductores();
      alert('Conductor registrado exitosamente.');
    } catch (err) {
      console.error(err);
      alert('Error al registrar el conductor.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gestión de Conductores</h2>
      </div>

      {/* Formulario para registrar conductor */}
      <form onSubmit={handleCreateConductor} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Nombre Completo</label>
          <input
            type="text"
            required
            placeholder="Nombre del conductor"
            value={nuevoConductor.nombre}
            onChange={(e) => setNuevoConductor({...nuevoConductor, nombre: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Documento</label>
          <input
            type="text"
            required
            placeholder="Cédula"
            value={nuevoConductor.documento}
            onChange={(e) => setNuevoConductor({...nuevoConductor, documento: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Teléfono</label>
          <input
            type="tel"
            required
            placeholder="300 000 0000"
            value={nuevoConductor.telefono}
            onChange={(e) => setNuevoConductor({...nuevoConductor, telefono: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Correo (cuenta de acceso)</label>
          <input
            type="email"
            required
            placeholder="conductor@enviosexpress.com"
            value={nuevoConductor.email}
            onChange={(e) => setNuevoConductor({...nuevoConductor, email: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Registrar Conductor</span>
        </button>
      </form>

      {/* Listado de conductores */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700 font-semibold text-sm">Conductores Registrados</div>
        {loading ? (
          <div className="p-6 text-center text-slate-500 text-sm">Cargando...</div>
        ) : conductores.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">No hay conductores registrados.</div>
        ) : (
          <div className="divide-y divide-slate-700">
            {conductores.map((c, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-blue-400">{c.nombre}</span>
                  <p className="text-slate-300 text-xs mt-0.5">Documento: {c.documento} — {c.email}</p>
                </div>
                <span className="text-xs text-slate-400">Tel: {c.telefono}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
