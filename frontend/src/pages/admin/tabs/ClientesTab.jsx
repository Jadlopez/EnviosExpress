import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import apiClient from '../../../api/client';

export default function ClientesTab() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({ nombre: '', telefono: '', direccion: '' });

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/clientes');
      setClientes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCliente = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/clientes', nuevoCliente);
      setNuevoCliente({ nombre: '', telefono: '', direccion: '' });
      fetchClientes();
      alert('Cliente registrado exitosamente.');
    } catch (err) {
      console.error(err);
      alert('Error al registrar el cliente.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gestión de Clientes</h2>
      </div>

      {/* Formulario para registrar cliente */}
      <form onSubmit={handleCreateCliente} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Nombre Completo</label>
          <input
            type="text"
            required
            placeholder="Nombre del cliente"
            value={nuevoCliente.nombre}
            onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Teléfono</label>
          <input
            type="tel"
            required
            placeholder="300 000 0000"
            value={nuevoCliente.telefono}
            onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Dirección</label>
          <input
            type="text"
            required
            placeholder="Dirección de contacto"
            value={nuevoCliente.direccion}
            onChange={(e) => setNuevoCliente({...nuevoCliente, direccion: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Registrar Cliente</span>
        </button>
      </form>

      {/* Listado de clientes */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700 font-semibold text-sm">Clientes Registrados</div>
        {loading ? (
          <div className="p-6 text-center text-slate-500 text-sm">Cargando...</div>
        ) : clientes.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">No hay clientes registrados.</div>
        ) : (
          <div className="divide-y divide-slate-700">
            {clientes.map((c, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-blue-400">{c.nombre}</span>
                  <p className="text-slate-300 text-xs mt-0.5">Dirección: {c.direccion}</p>
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
