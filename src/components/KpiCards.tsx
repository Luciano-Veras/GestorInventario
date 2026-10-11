import React from 'react';
import { FilterType, InventoryKPIs } from '../types/inventory';
import { Package, ShoppingCart, Truck, AlertTriangle } from 'lucide-react';

interface KpiCardsProps {
  kpis: InventoryKPIs;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  kpis,
  activeFilter,
  onFilterChange
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* TOTAL ITEMS */}
      <button
        onClick={() => onFilterChange('ALL')}
        className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden group shadow-xs cursor-pointer ${
          activeFilter === 'ALL'
            ? 'border-slate-400 bg-white ring-2 ring-slate-400/80 shadow-md'
            : 'border-slate-200/90 bg-white hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-slate-500" />
            Total Artículos
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            TOTAL
          </span>
        </div>
        <div className="text-3xl font-extrabold text-slate-900 mt-2 font-mono">
          {kpis.total}
        </div>
        <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
          <span>Universo completo del reporte</span>
          <span className="font-mono font-medium text-slate-600">{kpis.totalComprometido} comp.</span>
        </div>
      </button>

      {/* SUGERIDOS */}
      <button
        onClick={() => onFilterChange('SUGERIDOS')}
        className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden group shadow-xs cursor-pointer ${
          activeFilter === 'SUGERIDOS'
            ? 'border-sky-400 bg-[#f1f7fd] ring-2 ring-sky-400 shadow-md'
            : 'border-sky-200/90 bg-[#f1f7fd] hover:bg-[#e7f2fc]'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5 text-sky-700" />
            Sugeridos a Pedir
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 text-sky-700 border border-sky-200">
            SUG &gt; 0
          </span>
        </div>
        <div className="text-3xl font-extrabold text-sky-950 mt-2 font-mono">
          {kpis.sugeridos}
        </div>
        <div className="text-xs text-sky-800/80 mt-1 flex items-center justify-between">
          <span>Reposición activa requerida</span>
          <span className="font-mono font-semibold text-sky-900">+{kpis.totalSugeridoUnidades} u.</span>
        </div>
      </button>

      {/* RECLAMAR */}
      <button
        onClick={() => onFilterChange('RECLAMAR')}
        className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden group shadow-xs cursor-pointer ${
          activeFilter === 'RECLAMAR'
            ? 'border-amber-400 bg-[#fff9ee] ring-2 ring-amber-400 shadow-md'
            : 'border-amber-200/90 bg-[#fff9ee] hover:bg-[#fff2dd]'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-700" />
            Reclamar Proveedor
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
            DISP &gt; 0 &amp; NEC &lt; 0
          </span>
        </div>
        <div className="text-3xl font-extrabold text-amber-950 mt-2 font-mono">
          {kpis.reclamar}
        </div>
        <div className="text-xs text-amber-800/80 mt-1">
          Stock físico insuficiente, pero con OC en camino
        </div>
      </button>

      {/* URGENTE */}
      <button
        onClick={() => onFilterChange('URGENTE')}
        className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden group shadow-xs cursor-pointer ${
          activeFilter === 'URGENTE'
            ? 'border-rose-400 bg-[#fdf2f4] ring-2 ring-rose-400 shadow-md'
            : 'border-rose-200/90 bg-[#fdf2f4] hover:bg-[#fde7eb]'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
            Urgencia Crítica
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
            DISP &lt; 0
          </span>
        </div>
        <div className="text-3xl font-extrabold text-rose-950 mt-2 font-mono">
          {kpis.urgentes}
        </div>
        <div className="text-xs text-rose-800/80 mt-1">
          Quiebre crítico de inventario disponible
        </div>
      </button>
    </div>
  );
};
