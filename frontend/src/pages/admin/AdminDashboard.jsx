import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Truck, Package, MapPin, LogOut, Users, IdCard, FileBarChart, ShieldCheck } from 'lucide-react';
import EncomiendasTab from './tabs/EncomiendasTab';
import VehiculosTab from './tabs/VehiculosTab';
import ConductoresTab from './tabs/ConductoresTab';
import ClientesTab from './tabs/ClientesTab';
import RutasTab from './tabs/RutasTab';
import ReportesTab from './tabs/ReportesTab';
import UsuariosTab from './tabs/UsuariosTab';

const TABS = [
  { id: 'encomiendas', label: 'Encomiendas', icon: Package, Component: EncomiendasTab },
  { id: 'vehiculos', label: 'Vehículos / Flota', icon: Truck, Component: VehiculosTab },
  { id: 'conductores', label: 'Conductores', icon: IdCard, Component: ConductoresTab },
  { id: 'clientes', label: 'Clientes', icon: Users, Component: ClientesTab },
  { id: 'rutas', label: 'Rutas', icon: MapPin, Component: RutasTab },
  { id: 'reportes', label: 'Reportes', icon: FileBarChart, Component: ReportesTab },
  { id: 'usuarios', label: 'Usuarios', icon: ShieldCheck, Component: UsuariosTab, soloAdmin: true },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('encomiendas');
  const navigate = useNavigate();
  const rolActual = localStorage.getItem('rol');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const tabsVisibles = TABS.filter((tab) => !tab.soloAdmin || rolActual === 'ADMIN');
  const ActiveComponent = tabsVisibles.find((tab) => tab.id === activeTab)?.Component
    ?? tabsVisibles[0]?.Component;

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
            {tabsVisibles.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
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
        {ActiveComponent && <ActiveComponent />}
      </main>
    </div>
  );
}
