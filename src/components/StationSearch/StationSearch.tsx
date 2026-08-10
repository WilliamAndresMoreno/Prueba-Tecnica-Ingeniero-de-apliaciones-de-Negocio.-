import type { RefObject } from 'react';
import { Search, X } from 'lucide-react';

interface StationSearchProps {
  value: string;
  onChange: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement>;
}

export function StationSearch({ value, onChange, inputRef }: StationSearchProps) {
  return (
    <div className="station-search">
      <Search size={16} className="station-search__icon" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) {
            onChange('');
          }
        }}
        placeholder="Buscar por nombre o código… (atajo: /)"
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
