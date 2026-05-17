export interface Property {
  id: string;
  title: string;
  price: number;
  currency: 'USD' | 'ARS';
  operation: 'Venta' | 'Alquiler';
  type: 'Casa' | 'Departamento' | 'PH' | 'Lote' | 'Local';
  neighborhood: string;
  address: string;
  beds: number;
  baths: number;
  m2: number;
  description: string;
  images: string[];
  lat: number;
  lng: number;
  amenities: string[];
  active: boolean;
  featured?: boolean;
}

export const SPECTRUM_COLORS = [
  'green', 'cyan', 'blue', 'purple', 'magenta', 'red', 'orange', 'yellow'
];

export const SPECTRUM_HEX = {
  green: '#22c55e',
  cyan: '#06b6d4',
  blue: '#3b82f6',
  purple: '#a855f7',
  magenta: '#d946ef',
  red: '#ef4444',
  orange: '#f97316',
  yellow: '#eab308'
};
