import { useState, useMemo, useEffect } from 'react';
import { InventoryItem, FilterType, InventoryKPIs } from './types/inventory';
import { initialInventoryData } from './data/mockData';
import {
  parseExcelFile,
  exportInventoryToExcel,
  generateSampleExcelFile
} from './services/excelService';
import { Header } from './components/Header';
import { DropZone } from './components/DropZone';
import { KpiCards } from './components/KpiCards';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { InventoryTable } from './components/InventoryTable';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'gestor_inventario_data_v2';
const STORAGE_FILE_KEY = 'gestor_inventario_filename_v2';

export function App() {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    try {
      // Limpiar memoria de versiones previas para no retener datos reales
      localStorage.removeItem('gestor_inventario_data_v1');
      localStorage.removeItem('gestor_inventario_filename_v1');
      
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading stored inventory', e);
    }
    return initialInventoryData;
  });

  const [fileName, setFileName] = useState<string>(() => {
    return localStorage.getItem(STORAGE_FILE_KEY) || 'reporte_ejemplo.xlsx';
  });

  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      localStorage.setItem(STORAGE_FILE_KEY, fileName);
    } catch (e) {
      console.warn('Storage limit reached or blocked', e);
    }
  }, [items, fileName]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // File Upload
  const handleFileUpload = async (file: File) => {
    try {
      const { fileName: loadedName, items: parsedItems } = await parseExcelFile(file);
      if (parsedItems.length === 0) {
        showToast('No se detectaron filas válidas en el archivo. Revisa las cabeceras.', 'error');
        return;
      }
      setItems(parsedItems);
      setFileName(loadedName);
      setActiveFilter('ALL');
      setSearchQuery('');
      showToast(`¡Reporte procesado exitosamente! (${parsedItems.length} artículos detectados)`);
    } catch (err) {
      console.error(err);
      showToast('Error al leer el archivo Excel/CSV. Verifica el formato.', 'error');
    }
  };

  // Reset to Demo
  const handleResetDemo = () => {
    setItems(initialInventoryData);
    setFileName('reporte_ejemplo.xlsx');
    setActiveFilter('ALL');
    setSearchQuery('');
    showToast('Datos de demostración restablecidos.');
  };

  // KPIs
  const kpis: InventoryKPIs = useMemo(() => {
    return {
      total: items.length,
      sugeridos: items.filter(i => i.isSugerido).length,
      reclamar: items.filter(i => i.isReclamar).length,
      urgentes: items.filter(i => i.isUrgente).length,
      totalComprometido: items.reduce((sum, i) => sum + i.comprometido, 0),
      totalSugeridoUnidades: items.reduce((sum, i) => sum + (i.sugeridos || 0), 0),
    };
  }, [items]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return items.filter(it => {
      if (activeFilter === 'SUGERIDOS' && !it.isSugerido) return false;
      if (activeFilter === 'RECLAMAR' && !it.isReclamar) return false;
      if (activeFilter === 'URGENTE' && !it.isUrgente) return false;

      if (q) {
        const matchId = it.id.toLowerCase().includes(q);
        const matchName = it.nombre.toLowerCase().includes(q);
        if (!matchId && !matchName) return false;
      }
      return true;
    });
  }, [items, activeFilter, searchQuery]);

  // Export
  const handleExport = () => {
    if (filteredItems.length === 0) {
      showToast('No hay artículos en la vista actual para exportar.', 'error');
      return;
    }
    const filterSuffix = activeFilter !== 'ALL' ? `_${activeFilter.toLowerCase()}` : '';
    exportInventoryToExcel(filteredItems, `inventario_reporte${filterSuffix}.xlsx`);
    showToast(`Archivo Excel descargado con ${filteredItems.length} artículos.`);
  };

  // Download Sample Template
  const handleDownloadTemplate = () => {
    generateSampleExcelFile();
    showToast('Plantilla descargada: plantilla_ejemplo_inventario.xlsx');
  };

  return (
    <div className="min-h-screen bg-slate-50/90 text-slate-800 pb-20">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold ${
            toast.type === 'success' 
              ? 'bg-slate-900 text-white border-slate-800' 
              : 'bg-rose-900 text-white border-rose-800'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <Header
          fileName={fileName}
          onFileUpload={handleFileUpload}
          onExport={handleExport}
          onDownloadTemplate={handleDownloadTemplate}
          onResetDemo={handleResetDemo}
        />

        {/* Drop Zone */}
        <DropZone onFileDrop={handleFileUpload} fileName={fileName} />

        {/* KPI Cards */}
        <KpiCards
          kpis={kpis}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Visual Charts */}
        <AnalyticsCharts items={items} />

        {/* Interactive Inventory Table */}
        <InventoryTable
          items={filteredItems}
          onSelectItem={setSelectedItem}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Footer info for portfolio */}
        <footer className="pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>
            Desarrollado para optimización de inventarios, compras y abastecimiento continuo.
          </p>
          <p className="font-mono text-slate-400">
            React + TypeScript + Tailwind CSS + Vite
          </p>
        </footer>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}

export default App;
