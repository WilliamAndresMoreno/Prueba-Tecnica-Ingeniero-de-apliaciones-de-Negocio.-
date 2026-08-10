import type { Station } from '@/types';
import { StationCard } from './StationCard';

interface StationListProps {
  stations: Station[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  selectedStationId: string | null;
  onSelect: (stationId: string) => void;
  onToggleStatus: (stationId: string) => void;
  togglingStationId?: string | null;
}

export function StationList({
  stations,
  isLoading,
  isError,
  errorMessage,
  selectedStationId,
  onSelect,
  onToggleStatus,
  togglingStationId,
}: StationListProps) {
  if (isLoading) {
    return <p role="status">Cargando estaciones…</p>;
  }

  if (isError) {
    return (
      <p role="alert" className="error-text">
        No fue posible cargar las estaciones{errorMessage ? `: ${errorMessage}` : '.'}
      </p>
    );
  }

  if (stations.length === 0) {
    return <p>No hay estaciones registradas.</p>;
  }

  return (
    <ul className="station-list" aria-label="Listado de estaciones">
      {stations.map((station) => (
        <StationCard
          key={station.id}
          station={station}
          isSelected={station.stationId === selectedStationId}
          onSelect={onSelect}
          onToggleStatus={onToggleStatus}
          isTogglingStatus={togglingStationId === station.stationId}
        />
      ))}
    </ul>
  );
}
