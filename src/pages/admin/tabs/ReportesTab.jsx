import React, { useState } from 'react';
import { FileBarChart } from 'lucide-react';
import apiClient from '../../../api/client';

export default function ReportesTab() {
  const [reporte, setReporte] = useState({ desde: '', hasta: '' });
  const [reporteData, setReporteData] = useState(null);
  const [reporteLoading, setReporteLoading] = useState(false);
  const [reporteError, setReporteError] = useState('');

  const handleGenerarReporte = async (e) => {
    e.preventDefault();
    setReporteError('');
    setReporteData(null);
    setReporteLoading(true);
    try {
      const res = await apiClient.get('/reportes', {
        params: { desde: reporte.desde, hasta: reporte.hasta },
      });
      setReporteData(res.data);
    } catch (err) {
      console.error(err);
      setReporteError('No se pudo generar el reporte para el período seleccionado.');
    } finally {
      setReporteLoading(false);
    }
  };

  const descargarReporteCSV = () => {
    if (!reporteData || reporteData.length === 0) return;
    const columnas = Object.keys(reporteData[0]);
    const filas = reporteData.map((fila) =>
      columnas.map((col) => JSON.stringify(fila[col] ?? '')).join(',')
    );
    const csv = [columnas.join(','), ...filas].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-envios-express-${reporte.desde || 'inicio'}-a-${reporte.hasta || 'hoy'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Reportes de Rutas, Tiempos y Costos</h2>
      </div>

      <form onSubmit={handleGenerarReporte} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Desde</label>
          <input
            type="date"
            required
            value={reporte.desde}
            onChange={(e) => setReporte({...reporte, desde: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Hasta</label>
          <input
            type="date"
            required
            value={reporte.hasta}
            onChange={(e) => setReporte({...reporte, hasta: e.target.value})}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={reporteLoading}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center space-x-1 disabled:opacity-50"
        >
          <FileBarChart className="w-4 h-4" />
          <span>{reporteLoading ? 'Generando...' : 'Generar Reporte'}</span>
        </button>
      </form>

      {reporteError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-sm font-medium">
          {reporteError}
        </div>
      )}

      {reporteData && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <span className="font-semibold text-sm">Resultado del período consultado</span>
            <button
              onClick={descargarReporteCSV}
              disabled={reporteData.length === 0}
              className="text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-40"
            >
              Descargar CSV
            </button>
          </div>
          {reporteData.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-sm">No hay datos para el período seleccionado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-left text-slate-400 text-xs uppercase">
                    {Object.keys(reporteData[0]).map((col) => (
                      <th key={col} className="p-3 font-semibold">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {reporteData.map((fila, idx) => (
                    <tr key={idx}>
                      {Object.keys(reporteData[0]).map((col) => (
                        <td key={col} className="p-3 text-slate-200">{String(fila[col] ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
