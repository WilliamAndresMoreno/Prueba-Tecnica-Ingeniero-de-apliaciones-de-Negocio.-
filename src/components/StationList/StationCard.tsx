import type { Station } from '@/types';
import { StatusToggle } from '@/components/StatusToggle/StatusToggle';

interface StationCardProps {
  station: Station;
  isSelected: boolean;
  onSelect: (stationId: string) => void;
  onToggleStatus: (stationId: string) => void;
  isTogglingStatus?: boolean;
}

export function StationCard({
  station,
  isSelected,
  onSelect,
  onToggleStatus,
  isTogglingStatus,
}: StationCardProps) {
  return (
    <li>
      <article
        className={`station-card ${isSelected ? 'station-card--selected' : ''}`}
        aria-current={isSelected ? 'true' : undefined}
      >
        <button
          type="button"
          className="station-card__select"
          onClick={() => onSelect(station.stationId)}
          aria-pressed={isSelected}
        >
          <h3 className="station-card__name">{station.name}</h3>
          <p className="station-card__meta">Código: {station.stationId}</p>
        </button>

        <StatusToggle
          status={station.status}
          onToggle={() => onToggleStatus(station.stationId)}
          disabled={isTogglingStatus}
          stationName={station.name}
        />
      </article>
    </li>
  );
}
