import React, { useState } from 'react';
import { FileSpreadsheet, CheckCircle2 } from 'lucide-react';

interface DropZoneProps {
  onFileDrop: (file: File) => void;
  fileName?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFileDrop, fileName }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileDrop(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isDragging
          ? 'border-emerald-500 bg-emerald-50/50 scale-[1.005]'
          : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/70'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onFileDrop(e.target.files[0]);
          }
        }}
      />
      
      <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl border border-emerald-100/80 shrink-0">
          <FileSpreadsheet className="w-6 h-6 text-emerald-700" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800">
            {fileName ? `Reporte activo: ${fileName}` : 'Arrastra y suelta tu reporte Excel (.xlsx / .csv) aquí o haz clic'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Mapeo inteligente de columnas: <code className="font-mono text-slate-600 bg-slate-100 px-1 py-0.5 rounded">ARTICU_ID</code>, <code className="font-mono text-slate-600 bg-slate-100 px-1 py-0.5 rounded">TEXTO</code>, <code className="font-mono text-slate-600 bg-slate-100 px-1 py-0.5 rounded">CANT_STOCK</code>, <code className="font-mono text-slate-600 bg-slate-100 px-1 py-0.5 rounded">PENDIENTE_NP</code>, <code className="font-mono text-slate-600 bg-slate-100 px-1 py-0.5 rounded">CANT_DISPONIBLE</code>, <code className="font-mono text-slate-600 bg-slate-100 px-1 py-0.5 rounded">SUGERIDA_A_PEDIR</code>
          </p>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-1.5 text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-xl border border-slate-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Listo para procesar</span>
      </div>
    </div>
  );
};
