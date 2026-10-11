export type ItemStatus = 'URGENTE' | 'RECLAMAR' | 'SUGERIDO' | 'NORMAL';

export interface InventoryItem {
  id: string;
  nombre: string;
  stock: number;
  comprometido: number;
  disponible: number;
  necesidad: number;
  necesidadNegativa: boolean;
  sugeridos: number;
  cantOc: number;
  cantVendida: number;
  costo: number;
  moneda: string;
  stkMinimo: number;
  stkIdeal: number;
  status: ItemStatus;
  isUrgente: boolean;
  isReclamar: boolean;
  isSugerido: boolean;
}

export type FilterType = 'ALL' | 'SUGERIDOS' | 'RECLAMAR' | 'URGENTE';

export type SortField = 
  | 'id'
  | 'nombre'
  | 'stock'
  | 'comprometido'
  | 'disponible'
  | 'necesidad'
  | 'sugeridos'
  | 'cantOc'
  | 'cantVendida'
  | 'costo';

export type SortDirection = 'asc' | 'desc';

export interface InventoryKPIs {
  total: number;
  sugeridos: number;
  reclamar: number;
  urgentes: number;
  totalComprometido: number;
  totalSugeridoUnidades: number;
}
