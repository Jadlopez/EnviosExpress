import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import apiClient from '../../../api/client';

const ROLES = ['ADMIN', 'DESPACHADOR', 'CONDUCTOR', 'CLIENTE'];

export default function UsuariosTab() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seleccion, setSeleccion] = useState({});

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/usuarios');
      setUsuarios(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActualizarRol = async (usuarioId) => {
    const nuevoRol = seleccion[usuarioId];
    if (!nuevoRol) {
      alert('Selecciona un rol antes de actualizar.');
      return;
    }
    try {
      await apiClient.put(`/usuarios/${usuarioId}/rol`, { rol: nuevoRol });
      fetchUsuarios();
      alert('Rol actualizado exitosamente.');
    } catch (err) {
      console.error(err);
      alert('Error al actualizar el rol.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <span>Gestión de Usuarios y Roles</span>
        </h2>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700 font-semibold text-sm">Usuarios Registrados</div>
        {loading ? (
          <div className="p-6 text-center text-slate-500 text-sm">Cargando...</div>
        ) : usuarios.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-sm">No hay usuarios registrados.</div>
        ) : (
          <div className="divide-y divide-slate-700">
            {usuarios.map((u) => (
              <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                <div>
                  <span className="font-bold text-blue-400">{u.nombre}</span>
                  <p className="text-slate-300 text-xs mt-0.5">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-slate-700 text-slate-300 rounded-full text-xs font-medium">
                    {u.rol}
                  </span>
                  <select
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                    value={seleccion[u.id] || ''}
                    onChange={(e) => setSeleccion({...seleccion, [u.id]: e.target.value})}
                  >
                    <option value="">Cambiar rol a...</option>
                    {ROLES.filter((r) => r !== u.rol).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleActualizarRol(u.id)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors whitespace-nowrap"
                  >
                    Actualizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
