import type { Station } from '@/types';
import { StationCard } from './StationCard';
import { StationListSkeleton } from '@/components/Skeletons/Skeletons';

interface StationListProps {
  stations: Station[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  selectedStationId: string | null;
  onSelect: (stationId: string) => void;
  onToggleStatus: (stationId: string) => void;
  togglingStationId?: string | null;
  isFiltered?: boolean;
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
  isFiltered,
}: StationListProps) {
  if (isLoading) {
    return <StationListSkeleton />;
  }

  if (isError) {
    return (
      <p role="alert" className="error-text">
        No fue posible cargar las estaciones{errorMessage ? `: ${errorMessage}` : '.'}
      </p>
    );
  }

  if (stations.length === 0) {
    return (
      <p role="status">
        {isFiltered
          ? 'No hay estaciones que coincidan con tu búsqueda.'
          : 'No hay estaciones registradas.'}
      </p>
    );
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
