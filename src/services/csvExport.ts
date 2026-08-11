import type { Station } from '@/types';

const STATUS_LABEL: Record<Station['status'], string> = {
  active: 'Activa',
  inactive: 'Inactiva',
};

/** Escapa un valor para una celda CSV (comillas dobles, comas, saltos de línea). */
function escapeCsvValue(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function stationsToCsv(stations: Station[]): string {
  const header = ['Nombre', 'Código', 'Estado'];
  const rows = stations.map((s) => [s.name, s.stationId, STATUS_LABEL[s.status]]);

  return [header, ...rows]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\r\n');
}

/** Dispara la descarga del CSV en el navegador. */
export function downloadStationsCsv(stations: Station[], filename = 'estaciones.csv'): void {
  const csv = stationsToCsv(stations);
  // BOM UTF-8 para que Excel abra tildes/ñ correctamente.
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
