import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, Truck, Package, MapPin, LogOut, PlusCircle, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('encomiendas');
  const [encomiendas, setEncomiendas] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Estados para formularios rápidos
  const [nuevaEncomienda, setNuevaEncomienda] = useState({ codigoGuia: '', nombreDestinatario: '', direccionDestino: '' });
  const [nuevoVehiculo, setNuevoVehiculo] = useState({ placa: '', modelo: '', capacidadKg: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (activeTab === 'encomiendas') fetchEncomiendas();
    if (activeTab === 'vehiculos') fetchVehiculos();
  }, [activeTab]);

  const fetchEncomiendas = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/v1/encomiendas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEncomiendas(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehiculos = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/v1/vehiculos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehiculos(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEncomienda = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/v1/encomiendas', nuevaEncomienda, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNuevaEncomienda({ codigoGuia: '', nombreDestinatario: '', direccionDestino: '' });
      fetchEncomiendas();
      alert('Encomienda creada exitosamente.');
    } catch (err) {
      console.error(err);
      alert('Error al registrar la encomienda.');
    }
  };

  const handleCreateVehiculo = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/v1/vehiculos', nuevoVehiculo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNuevoVehiculo({ placa: '', modelo: '', capacidadKg: '' });
      fetchVehiculos();
      alert('Vehículo registrado exitosamente.');
    } catch (err) {
      console.error(err);
      alert('Error al registrar el vehículo.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row">
      {/* Barra lateral de navegación */}
      <aside className="w-full md:w-64 bg-slate-800 border-r border-slate-700 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-sm">Envíos Express</h1>
              <p className="text-xs text-slate-400">Panel de Administración</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('encomiendas')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'encomiendas' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Encomiendas</span>
            </button>
            <button
              onClick={() => setActiveTab('vehiculos')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === 'vehiculos' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Vehículos / Flota</span>
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-semibold transition-colors mt-6 md:mt-0"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {activeTab === 'encomiendas' && (
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
                  {encomiendas.map((item, idx) => (
                    <div key={idx} className="p-4 flex justify-between items-center text-sm">
                      <div>
                        <span className="font-bold text-blue-400">{item.codigoGuia}</span>
                        <p className="text-slate-300 text-xs mt-0.5">Destinatario: {item.nombreDestinatario} ({item.direccionDestino})</p>
                      </div>
                      <span className="px-2.5 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-medium">
                        {item.estado || 'REGISTRADO'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'vehiculos' && (
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
        )}
      </main>
    </div>
  );
}