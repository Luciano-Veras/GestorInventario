import React from 'react';
import { InventoryItem } from '../types/inventory';
import { X, AlertTriangle, Truck, ShoppingCart, CheckCircle, Boxes, DollarSign, TrendingUp, Info } from 'lucide-react';

interface ProductDetailModalProps {
  item: InventoryItem | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  const inversionEstimada = item.sugeridos * item.costo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-slate-200/70 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-300/60">
                #{item.id}
              </span>
              {item.isUrgente && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#fde7eb] text-[#9c1b35] border border-rose-200 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> URGENTE
                </span>
              )}
              {item.isReclamar && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#fff0d6] text-[#8e5207] border border-amber-200 font-bold flex items-center gap-1">
                  <Truck className="w-3 h-3" /> RECLAMAR OC
                </span>
              )}
              {item.isSugerido && !item.isUrgente && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#e6f1fc] text-[#134d7d] border border-sky-200 font-bold flex items-center gap-1">
                  <ShoppingCart className="w-3 h-3" /> SUGERIDO
                </span>
              )}
              {!item.isUrgente && !item.isReclamar && !item.isSugerido && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> NORMAL
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2 leading-snug">
              {item.nombre}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Stock Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Stock Físico</span>
              <span className="text-2xl font-extrabold font-mono text-slate-800 mt-1 block">
                {item.stock}
              </span>
              <span className="text-[10px] text-slate-400">En depósito</span>
            </div>

            <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200/70">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">Comprometido</span>
              <span className="text-2xl font-extrabold font-mono text-amber-900 mt-1 block">
                {item.comprometido}
              </span>
              <span className="text-[10px] text-amber-700/80">Pedidos clientes</span>
            </div>

            <div className={`p-3.5 rounded-2xl border ${
              item.disponible < 0 
                ? 'bg-rose-50/80 border-rose-200 text-rose-900' 
                : 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
            }`}>
              <span className="text-[11px] font-bold uppercase tracking-wider block">Disponible</span>
              <span className="text-2xl font-extrabold font-mono mt-1 block">
                {item.disponible}
              </span>
              <span className="text-[10px] opacity-80">Saldo neto</span>
            </div>

            <div className="p-3.5 bg-sky-50/70 rounded-2xl border border-sky-200/70">
              <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">Sugerido</span>
              <span className="text-2xl font-extrabold font-mono text-sky-900 mt-1 block">
                {item.sugeridos}
              </span>
              <span className="text-[10px] text-sky-700">A pedir</span>
            </div>
          </div>

          {/* Operational Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Órdenes de Compra en Tránsito</span>
                <span className="text-lg font-bold font-mono text-slate-900">
                  {item.cantOc} <span className="text-xs font-normal text-slate-500">unidades emitidas</span>
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-indigo-700" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Venta / Consumo Registrado</span>
                <span className="text-lg font-bold font-mono text-slate-900">
                  {item.cantVendida} <span className="text-xs font-normal text-slate-500">unidades período</span>
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Costo Unitario Registrado</span>
                <span className="text-lg font-bold font-mono text-slate-900">
                  {item.costo ? `$${item.costo.toLocaleString('es-AR')}` : 'Sin costo registrado'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <Boxes className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Inversión Sugerida Estimada</span>
                <span className="text-lg font-bold font-mono text-emerald-800">
                  {inversionEstimada > 0 ? `$${inversionEstimada.toLocaleString('es-AR')}` : '$0'}
                </span>
              </div>
            </div>
          </div>

          {/* Explanation Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Info className="w-4 h-4 text-emerald-700" />
              <span>Análisis de Abastecimiento & Regla Aplicada:</span>
            </div>
            {item.isUrgente && (
              <p>
                ⚠️ <strong>Rotura de stock crítico:</strong> El stock disponible neto es negativo (<code className="font-mono font-bold text-rose-700">{item.disponible}</code>). Significa que los pedidos comprometidos superan tanto el stock físico como las órdenes de compra emitidas. Se requiere emisión urgente de pedido.
              </p>
            )}
            {item.isReclamar && (
              <p>
                🚚 <strong>Reclamar entrega:</strong> El stock físico no cubre los compromisos actuales (Necesidad: <code className="font-mono font-bold text-amber-700">{item.necesidad}</code>), pero ya existen <code className="font-mono font-bold text-slate-800">{item.cantOc}</code> unidades en órdenes de compra en camino. Se debe gestionar el pronto despacho con el proveedor en lugar de generar un duplicado de pedido.
              </p>
            )}
            {item.isSugerido && !item.isUrgente && (
              <p>
                🛒 <strong>Reposición recomendada:</strong> El sistema sugiere pedir <code className="font-mono font-bold text-sky-700">{item.sugeridos}</code> unidades para mantener niveles de rotación óptimos.
              </p>
            )}
            {!item.isUrgente && !item.isReclamar && !item.isSugerido && (
              <p>
                ✅ <strong>Situación controlada:</strong> Los niveles de stock actuales son suficientes para atender la demanda estimada sin generar quiebre.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
};
