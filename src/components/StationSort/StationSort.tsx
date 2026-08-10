import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'name-asc' | 'name-desc' | 'status-active-first' | 'status-inactive-first';

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'name-asc', label: 'Nombre (A-Z)' },
  { value: 'name-desc', label: 'Nombre (Z-A)' },
  { value: 'status-active-first', label: 'Activas primero' },
  { value: 'status-inactive-first', label: 'Inactivas primero' },
];

interface StationSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function StationSort({ value, onChange }: StationSortProps) {
  return (
    <label className="station-sort">
      <ArrowUpDown size={14} aria-hidden="true" />
      <span className="visually-hidden">Ordenar estaciones</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="station-sort__select"
        aria-label="Ordenar estaciones"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
