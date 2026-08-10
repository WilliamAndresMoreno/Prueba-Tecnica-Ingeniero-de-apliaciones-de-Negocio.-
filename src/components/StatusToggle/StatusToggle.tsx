import type { StationOperationalStatus } from '@/types';

interface StatusToggleProps {
  status: StationOperationalStatus;
  onToggle: () => void;
  disabled?: boolean;
  stationName: string;
}

export function StatusToggle({ status, onToggle, disabled, stationName }: StatusToggleProps) {
  const isActive = status === 'active';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      aria-label={`Estado de ${stationName}: ${isActive ? 'activa' : 'inactiva'}. Presiona para cambiar.`}
      disabled={disabled}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      className={`status-toggle ${isActive ? 'status-toggle--active' : 'status-toggle--inactive'}`}
    >
      <span className="status-toggle__dot" aria-hidden="true" />
      {isActive ? 'Activa' : 'Inactiva'}
    </button>
  );
}
