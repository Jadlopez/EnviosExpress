import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Truck, Package, CheckCircle2, AlertTriangle, LogOut, Navigation, RefreshCw } from 'lucide-react';

export default function DriverDashboard() {
  const [encomiendas, setEncomiendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHojaDeRuta();
  }, []);

  const fetchHojaDeRuta = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/v1/conductor/mis-rutas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEncomiendas(response.data);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la hoja de ruta o el servidor no responde.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (idEncomienda, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/v1/conductor/encomienda/${idEncomienda}/estado`, 
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchHojaDeRuta();
    } catch (err) {
      console.error(err);
      alert('Error al actualizar el estado de la encomienda.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Barra superior fija y adaptada a móvil */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 sm:px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
            <Truck className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg">Panel Conductor</h1>
            <p className="text-xs sm:text-sm text-slate-400">Ruta Activa</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </header>

      {/* Contenido principal con ancho flexible por dimensiones */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 w-full flex-grow">
        
        {/* Cabecera de sección y botón de refresco táctil */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
            <Package className="w-6 h-6 text-blue-400" />
            <span>Encomiendas Asignadas</span>
          </h2>
          <button 
            onClick={fetchHojaDeRuta} 
            className="w-full sm:w-auto text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700 transition-colors flex items-center justify-center space-x-2 font-medium shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
            <span>Actualizar Lista</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-slate-400 text-base">Cargando encomiendas...</div>
        ) : encomiendas.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center text-slate-300 shadow-xl">
            <p className="text-base">No tienes encomiendas asignadas en este momento.</p>
          </div>
        ) : (
          /* Lista responsiva de tarjetas */
          <div className="space-y-4">
            {encomiendas.map((item) => (
              <div 
                key={item.id || item.codigoGuia}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col gap-4 transition-all hover:border-slate-600"
              >
                {/* Info principal de la guía */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-slate-700/60 pb-3">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">Código de Guía</span>
                    <span className="text-xl font-extrabold text-blue-400">{item.codigoGuia}</span>
                  </div>
                  <span className="self-start sm:self-auto px-3 py-1 bg-slate-700/80 text-slate-200 rounded-full text-xs font-bold tracking-wide">
                    {item.estado}
                  </span>
                </div>

                <div className="space-y-2 text-sm sm:text-base">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block">Destinatario</span>
                    <span className="font-semibold text-white">{item.nombreDestinatario}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block">Dirección de Destino</span>
                    <p className="font-medium text-slate-200 flex items-start space-x-1.5 mt-0.5">
                      <Navigation className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{item.direccionDestino}</span>
                    </p>
                  </div>
                </div>

                {/* Botones de acción táctiles grandes ideales para uso en celular */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/60">
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'ENTREGADO')}
                    className="w-full py-3.5 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-sm sm:text-base font-bold flex items-center justify-center space-x-2 transition-colors active:scale-95"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Marcar Entregado</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'INCIDENCIA')}
                    className="w-full py-3.5 px-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-sm sm:text-base font-bold flex items-center justify-center space-x-2 transition-colors active:scale-95"
                  >
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <span>Reportar Incidencia</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}