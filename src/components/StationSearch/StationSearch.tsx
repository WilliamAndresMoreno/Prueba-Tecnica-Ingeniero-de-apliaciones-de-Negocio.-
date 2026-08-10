import { Search, X } from 'lucide-react';

interface StationSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function StationSearch({ value, onChange }: StationSearchProps) {
  return (
    <div className="station-search">
      <Search size={16} className="station-search__icon" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por nombre o código…"
        aria-label="Buscar estación por nombre o código"
        className="station-search__input"
      />
      {value && (
        <button
          type="button"
          className="station-search__clear"
          onClick={() => onChange('')}
          aria-label="Limpiar búsqueda"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
