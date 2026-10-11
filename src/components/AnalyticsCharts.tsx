import React, { useState } from 'react';
import { InventoryItem } from '../types/inventory';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { BarChart3, ChevronDown, ChevronUp } from 'lucide-react';

interface AnalyticsChartsProps {
  items: InventoryItem[];
}

const STATUS_COLORS = {
  URGENTE: '#f43f5e',
  RECLAMAR: '#f59e0b',
  SUGERIDO: '#0284c7',
  NORMAL: '#10b981',
};

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (items.length === 0) return null;

  // 1. Data for Status Pie Chart
  const statusCounts = {
    URGENTE: items.filter(i => i.isUrgente).length,
    RECLAMAR: items.filter(i => i.isReclamar).length,
    SUGERIDO: items.filter(i => i.isSugerido && !i.isUrgente).length,
    NORMAL: items.filter(i => !i.isUrgente && !i.isReclamar && !i.isSugerido).length,
  };

  const pieData = [
    { name: 'Urgente', value: statusCounts.URGENTE, color: STATUS_COLORS.URGENTE },
    { name: 'Reclamar OC', value: statusCounts.RECLAMAR, color: STATUS_COLORS.RECLAMAR },
    { name: 'Sugerido', value: statusCounts.SUGERIDO, color: STATUS_COLORS.SUGERIDO },
    { name: 'Normal', value: statusCounts.NORMAL, color: STATUS_COLORS.NORMAL },
  ].filter(d => d.value > 0);

  // 2. Data for Top 5 Sugeridos Bar Chart
  const topSugeridos = [...items]
    .filter(i => i.sugeridos > 0)
    .sort((a, b) => b.sugeridos - a.sugeridos)
    .slice(0, 5)
    .map(i => ({
      name: i.nombre.length > 18 ? i.nombre.substring(0, 18) + '...' : i.nombre,
      fullName: i.nombre,
      sugeridos: i.sugeridos,
      disponible: i.disponible
    }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition"
      >
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Métricas Visuales & Distribución de Inventario
          </span>
          <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
            {items.length} artículos analizados
          </span>
        </div>
        <button className="text-slate-500 hover:text-slate-800 transition">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50/50 border border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Distribución por Estado Operativo
            </h4>
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value} ítems`, name]}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {pieData.map(entry => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  <span>{entry.name}: <strong className="font-mono text-slate-800">{entry.value}</strong></span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex flex-col p-4 rounded-xl bg-slate-50/50 border border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Top 5 Artículos con Mayor Pedido Sugerido
            </h4>
            {topSugeridos.length > 0 ? (
              <div className="w-full h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topSugeridos} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      angle={-15}
                      textAnchor="end"
                      height={40}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip
                      formatter={(val: any) => [`${val} unidades`, 'Sugeridos']}
                      labelFormatter={(label, payload) => {
                        const full = payload[0]?.payload?.fullName;
                        return full || label;
                      }}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    />
                    <Bar dataKey="sugeridos" fill="#0284c7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
                No hay productos con pedidos sugeridos activos
              </div>
            )}
            <p className="text-[11px] text-slate-500 text-center mt-2">
              Prioridad de abastecimiento calculada según demanda y stock de seguridad
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
