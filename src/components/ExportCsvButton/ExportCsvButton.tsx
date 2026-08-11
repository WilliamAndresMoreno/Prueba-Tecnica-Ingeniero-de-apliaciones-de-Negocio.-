import { Download } from 'lucide-react';
import type { Station } from '@/types';
import { downloadStationsCsv } from '@/services/csvExport';

interface ExportCsvButtonProps {
  stations: Station[];
  disabled?: boolean;
}

export function ExportCsvButton({ stations, disabled }: ExportCsvButtonProps) {
  return (
    <button
      type="button"
      className="export-csv-button"
      disabled={disabled || stations.length === 0}
      onClick={() => downloadStationsCsv(stations)}
      title="Exportar la vista actual (respeta filtro y orden) como CSV"
    >
      <Download size={14} aria-hidden="true" />
      Exportar CSV
    </button>
  );
}
