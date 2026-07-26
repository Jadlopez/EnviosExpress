import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import apiClient from '../../../api/client';

export default function VehiculosTab() {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevoVehiculo, setNuevoVehiculo] = useState({ placa: '', modelo: '', capacidadKg: '' });

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const fetchVehiculos = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/vehiculos');
      setVehiculos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateVehiculo = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/vehiculos', nuevoVehiculo);
      setNuevoVehiculo({ placa: '', modelo: '', capacidadKg: '' });
      fetchVehiculos();
      alert('Vehículo registrado exitosamente.');
    } catch (err) {
      console.error(err);
      alert('Error al registrar el vehículo.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Gestión de Vehículos</h2>
      </div>

      {/* Formulario para registrar vehículo */}
      <form onSubmit={handleCreateVehiculo} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Placa</label>
          <input
            type="text"
            required
            placeholder="ABC-123"
            value={nuevoVehiculo.placa}
            onChange={(e) => setNuevoVehiculo({...nuevoVehiculo, placa: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Modelo / Marca</label>
          <input
            type="text"
            required
            placeholder="Chevrolet NHR"
            value={nuevoVehiculo.modelo}
            onChange={(e) => setNuevoVehiculo({...nuevoVehiculo, modelo: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Capacidad (Kg)</label>
          <input
            type="number"
            required
            placeholder="1500"
            value={nuevoVehiculo.capacidadKg}
            onChange={(e) => setNuevoVehiculo({...nuevoVehiculo, capacidadKg: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Guardar Vehículo</span>
        </button>
      </form>

      {/* Listado de vehículos */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700 font-semibold text-sm">Flota Registrada</div>
        {loading ? (
          <div className="p-6 text-center text-slate-500 text-sm">Cargando...</div>
        ) : vehiculos.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">No hay vehículos registrados.</div>
        ) : (
          <div className="divide-y divide-slate-700">
            {vehiculos.map((v, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center text-sm">
                <div>
                  <span className="font-bold text-blue-400">{v.placa}</span>
                  <p className="text-slate-300 text-xs mt-0.5">Modelo: {v.modelo}</p>
                </div>
                <span className="text-xs text-slate-400">Capacidad: {v.capacidadKg} Kg</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
