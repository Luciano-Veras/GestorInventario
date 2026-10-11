import * as XLSX from 'xlsx';
import { InventoryItem } from '../types/inventory';

export function parseNum(val: unknown): number {
  if (val == null) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  let s = String(val).replace(/["'$ ]/g, '').trim();
  if (s.includes('.') && s.includes(',')) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (s.includes(',')) {
    s = s.replace(',', '.');
  }
  const p = parseFloat(s);
  return isNaN(p) ? 0 : p;
}

export function processExcelRows(rows: unknown[][]): InventoryItem[] {
  let headerIdx = -1;
  const maxSearchRows = Math.min(rows.length, 25);
  
  for (let i = 0; i < maxSearchRows; i++) {
    const row = rows[i];
    if (!row || !Array.isArray(row)) continue;
    const txt = row.map(c => String(c ?? '').toUpperCase()).join(' ');
    if (txt.includes('ARTICU_ID') || txt.includes('CANT_STOCK') || txt.includes('PENDIENTE_NP') || txt.includes('PRODUCTO')) {
      headerIdx = i;
      break;
    }
  }
  if (headerIdx === -1) headerIdx = 0;

  const headerRow = rows[headerIdx];
  if (!headerRow || !Array.isArray(headerRow)) return [];

  const headers = headerRow.map(h => String(h ?? '').toUpperCase().trim());
  const findCol = (patterns: string[]): number => 
    headers.findIndex(h => patterns.some(p => h.includes(p)));

  const colId = findCol(['ARTICU_ID', 'CODIGO', 'ID', 'ITEM_ID']);
  const colTexto = findCol(['TEXTO', 'NOMBRE', 'DESCRIPCION', 'PRODUCTO', 'DETALLE']);
  const colStock = findCol(['CANT_STOCK', 'STOCK_FISICO', 'STOCK', 'EXISTENCIA']);
  const colComp = findCol(['PENDIENTE_NP', 'COMPROMETIDO', 'RESERVADO', 'PEDIDOS_CLI']);
  const colDisp = findCol(['CANT_DISPONIBLE', 'DISPONIBLE', 'STOCK_DISPONIBLE']);
  const colSug = findCol(['SUGERIDA_A_PEDIR', 'SUGERIDOS', 'SUGERIDO', 'A_PEDIR']);
  const colOc = findCol(['CANT_OC', 'OC_TRANSITO', 'PENDIENTE_RECIBIR', 'OC']);
  const colVendida = findCol(['CANT_VENDIDA', 'VENTAS', 'CONSUMO_MES', 'SALIDAS']);
  const colCosto = findCol(['COSTO', 'PRECIO_COSTO', 'VALOR_UNITARIO']);

  const items: InventoryItem[] = [];

  for (let r = headerIdx + 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || !Array.isArray(row) || row.length === 0) continue;

    const id = colId !== -1 ? String(row[colId] ?? '').trim() : '';
    const nombre = colTexto !== -1 ? String(row[colTexto] ?? '').trim() : '';
    if (!id && !nombre) continue;

    const stock = colStock !== -1 ? parseNum(row[colStock]) : 0;
    const comprometido = colComp !== -1 ? parseNum(row[colComp]) : 0;
    const disponible = colDisp !== -1 ? parseNum(row[colDisp]) : 0;
    const sugeridos = colSug !== -1 ? parseNum(row[colSug]) : 0;
    const cantOc = colOc !== -1 ? parseNum(row[colOc]) : 0;
    const cantVendida = colVendida !== -1 ? parseNum(row[colVendida]) : 0;
    const costo = colCosto !== -1 ? parseNum(row[colCosto]) : 0;

    const necesidad = stock - comprometido;
    const isUrgente = disponible < 0;
    const isReclamar = disponible > 0 && necesidad < 0;
    const isSugerido = sugeridos > 0;

    let status: InventoryItem['status'] = 'NORMAL';
    if (isUrgente) status = 'URGENTE';
    else if (isReclamar) status = 'RECLAMAR';
    else if (isSugerido) status = 'SUGERIDO';

    items.push({
      id: id || String(items.length + 1),
      nombre: nombre || `Producto ${id}`,
      stock,
      comprometido,
      disponible,
      sugeridos,
      necesidad,
      necesidadNegativa: necesidad < 0,
      cantOc,
      cantVendida,
      costo,
      moneda: '$',
      stkMinimo: 0,
      stkIdeal: 0,
      status,
      isUrgente,
      isReclamar,
      isSugerido
    });
  }

  return items;
}

export function parseExcelFile(file: File): Promise<{ fileName: string; items: InventoryItem[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        const data = new Uint8Array(buffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: '' });
        const items = processExcelRows(rows);
        resolve({ fileName: file.name, items });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

export function exportInventoryToExcel(items: InventoryItem[], filename = 'reporte_inventario.xlsx') {
  const exportData = items.map(item => ({
    'ID ARTÍCULO': item.id,
    'DESCRIPCIÓN / PRODUCTO': item.nombre,
    'STOCK FÍSICO': item.stock,
    'COMPROMETIDO (NP)': item.comprometido,
    'DISPONIBLE': item.disponible,
    'NECESIDAD': item.necesidad,
    'SUGERIDA A PEDIR': item.sugeridos,
    'OC EN TRÁNSITO': item.cantOc,
    'ESTADO': item.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario');
  XLSX.writeFile(workbook, filename);
}

export function generateSampleExcelFile() {
  const sampleRows = [
    {
      'ARTICU_ID': '101',
      'TEXTO': 'CAFÉ TOSTADO NATURAL EN GRANO 500G',
      'CANT_STOCK': -5,
      'PENDIENTE_NP': 25,
      'CANT_DISPONIBLE': -30,
      'SUGERIDA_A_PEDIR': 50,
      'CANT_OC': 0
    },
    {
      'ARTICU_ID': '102',
      'TEXTO': 'ACEITE DE OLIVA EXTRA VIRGEN 500ML',
      'CANT_STOCK': 4,
      'PENDIENTE_NP': 18,
      'CANT_DISPONIBLE': 26,
      'SUGERIDA_A_PEDIR': 0,
      'CANT_OC': 40
    },
    {
      'ARTICU_ID': '103',
      'TEXTO': 'TÉ VERDE ORGÁNICO EN SAQUITOS X 25',
      'CANT_STOCK': 22,
      'PENDIENTE_NP': 8,
      'CANT_DISPONIBLE': 14,
      'SUGERIDA_A_PEDIR': 30,
      'CANT_OC': 0
    },
    {
      'ARTICU_ID': '104',
      'TEXTO': 'ARROZ INTEGRAL GRANO LARGO 1KG',
      'CANT_STOCK': 80,
      'PENDIENTE_NP': 15,
      'CANT_DISPONIBLE': 65,
      'SUGERIDA_A_PEDIR': 0,
      'CANT_OC': 0
    }
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla ERP');
  XLSX.writeFile(workbook, 'plantilla_ejemplo_inventario.xlsx');
}
