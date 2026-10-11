import React from 'react';
import { Upload, Download, FileSpreadsheet, RotateCcw } from 'lucide-react';

interface HeaderProps {
  fileName: string;
  onFileUpload: (file: File) => void;
  onExport: () => void;
  onDownloadTemplate: () => void;
  onResetDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  fileName,
  onFileUpload,
  onExport,
  onDownloadTemplate,
  onResetDemo
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-200/80 gap-5">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
            Sistema Autónomo
          </span>
          <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/80 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {fileName || 'Datos de Demostración'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
          Control de Inventario & Análisis de Abastecimiento
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Procesa reportes de compras y stock ERP (.xlsx / .csv). Detecta automáticamente sugeridos de compra, artículos para reclamar con OC en tránsito y quiebres urgentes.
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-2.5">
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={handleFileChange}
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2.5 bg-[#3f7263] hover:bg-[#346053] text-white font-semibold text-sm rounded-xl shadow-xs flex items-center gap-2 transition active:scale-95 cursor-pointer"
          title="Cargar nuevo archivo Excel o CSV"
        >
          <Upload className="w-4 h-4" />
          <span>Cargar Excel</span>
        </button>

        <button
          onClick={onExport}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 shadow-xs flex items-center gap-2 transition active:scale-95 cursor-pointer"
          title="Exportar los resultados filtrados a un nuevo archivo Excel"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Exportar</span>
        </button>

        <button
          onClick={onDownloadTemplate}
          className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          title="Descargar una plantilla modelo para probar el cargador"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Plantilla Ejemplo</span>
        </button>

        <button
          onClick={onResetDemo}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl border border-slate-200 flex items-center justify-center transition active:scale-95 cursor-pointer"
          title="Restablecer dataset de demostración"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
