import React, { useState, useMemo } from 'react';
import { InventoryItem, SortField, SortDirection } from '../types/inventory';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  AlertTriangle,
  Truck,
  ShoppingCart
} from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItem[];
  onSelectItem: (item: InventoryItem) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  onSelectItem,
  searchQuery,
  onSearchChange
}) => {
  const [sortField, setSortField] = useState<SortField>('disponible');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(25);

  // Reset page when search or items change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, items.length]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 1. Sort items
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        const cmp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
        return sortDirection === 'asc' ? cmp : -cmp;
      }

      valA = valA as number;
      valB = valB as number;
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }, [items, sortField, sortDirection]);

  // 2. Paginate
  const totalItems = sortedItems.length;
  const isAllPages = pageSize === -1;
  const totalPages = isAllPages ? 1 : Math.max(1, Math.ceil(totalItems / pageSize));
  
  const paginatedItems = useMemo(() => {
    if (isAllPages) return sortedItems;
    const start = (currentPage - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [sortedItems, currentPage, pageSize, isAllPages]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-emerald-700" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-emerald-700" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Bar & Table Controls */}
      <div className="p-4 rounded-2xl border border-slate-200/90 bg-white flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filtrar por ID (código) o Nombre del producto..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 text-xs text-slate-500 font-mono">
          <span>Mostrando <strong className="text-slate-900 font-bold">{totalItems}</strong> artículos</span>
          
          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
            <span className="text-slate-400 font-sans">Por pág:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 font-mono focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="-1">Todas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 select-none">
              <tr>
                <th
                  onClick={() => handleSort('id')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>ID</span>
                    {renderSortIcon('id')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('nombre')}
                  className="py-3.5 px-4 min-w-[280px] cursor-pointer hover:bg-slate-100/80 transition group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Producto</span>
                    {renderSortIcon('nombre')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('stock')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100/80 transition group"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Stock</span>
                    {renderSortIcon('stock')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('comprometido')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100/80 transition group"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Comprometido</span>
                    {renderSortIcon('comprometido')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('disponible')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100/80 transition group"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Disponible</span>
                    {renderSortIcon('disponible')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('necesidad')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100/80 transition group"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Necesidad (&lt; 0)</span>
                    {renderSortIcon('necesidad')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('sugeridos')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100/80 transition group"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Sugeridos</span>
                    {renderSortIcon('sugeridos')}
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Estado</th>
                <th className="py-3.5 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-slate-500">
                    <p className="font-semibold text-slate-700">No se encontraron productos coincidentes</p>
                    <p className="text-xs text-slate-400 mt-1">Prueba cambiando el texto de búsqueda o el filtro activo</p>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const dispClass =
                    item.disponible < 0
                      ? 'text-rose-800 bg-[#fde9ec] border border-rose-200 px-2 py-0.5 rounded font-bold'
                      : item.disponible === 0
                      ? 'text-slate-400'
                      : 'text-emerald-800 bg-[#edf7f1] border border-emerald-200/80 px-2 py-0.5 rounded font-bold';

                  const sugClass =
                    item.sugeridos > 0
                      ? 'text-sky-800 bg-[#eaf3fc] border border-sky-200 px-2 py-0.5 rounded font-bold'
                      : 'text-slate-400';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className="hover:bg-slate-50/80 transition cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-mono text-slate-700 text-xs font-bold">
                        <span className="bg-slate-100 group-hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-200 transition">
                          #{item.id}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-semibold max-w-xs truncate" title={item.nombre}>
                        {item.nombre}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-700">
                        {item.stock}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-amber-800 font-semibold">
                        {item.comprometido}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        <span className={dispClass}>{item.disponible}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        {item.necesidadNegativa ? (
                          <span className="font-bold text-rose-800 font-mono bg-[#fde7eb] px-2 py-0.5 rounded border border-rose-200">
                            {item.necesidad}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        <span className={sugClass}>{item.sugeridos}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.isUrgente && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#fde7eb] text-[#9c1b35] border border-rose-200 font-bold inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> URGENTE
                          </span>
                        )}
                        {item.isReclamar && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#fff0d6] text-[#8e5207] border border-amber-200 font-bold inline-flex items-center gap-1">
                            <Truck className="w-3 h-3" /> RECLAMAR
                          </span>
                        )}
                        {item.isSugerido && !item.isUrgente && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#e6f1fc] text-[#134d7d] border border-sky-200 font-bold inline-flex items-center gap-1">
                            <ShoppingCart className="w-3 h-3" /> SUGERIDO
                          </span>
                        )}
                        {!item.isUrgente && !item.isReclamar && !item.isSugerido && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            Normal
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectItem(item);
                          }}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
                          title="Ver detalle completo"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {!isAllPages && totalPages > 1 && (
          <div className="p-3.5 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono">
            <div>
              Página <strong className="text-slate-800">{currentPage}</strong> de <strong className="text-slate-800">{totalPages}</strong>
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Primera página"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 font-semibold text-slate-700 bg-white rounded-lg border border-slate-200">
                {currentPage}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Página siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                title="Última página"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
