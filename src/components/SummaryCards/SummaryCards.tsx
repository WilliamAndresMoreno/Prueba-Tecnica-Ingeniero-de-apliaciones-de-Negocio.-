import { CircleDot, CircleSlash, LayoutGrid } from 'lucide-react';
import type { Station } from '@/types';

interface SummaryCardsProps {
  stations: Station[];
}

export function SummaryCards({ stations }: SummaryCardsProps) {
  const total = stations.length;
  const active = stations.filter((s) => s.status === 'active').length;
  const inactive = total - active;

  const items = [
    { label: 'Total de estaciones', value: total, icon: LayoutGrid, tone: 'neutral' as const },
    { label: 'Activas', value: active, icon: CircleDot, tone: 'success' as const },
    { label: 'Inactivas', value: inactive, icon: CircleSlash, tone: 'danger' as const },
  ];

  return (
    <div className="summary-cards" role="group" aria-label="Resumen de estaciones">
      {items.map(({ label, value, icon: Icon, tone }) => (
        <div key={label} className={`summary-card summary-card--${tone}`}>
          <span className="summary-card__icon" aria-hidden="true">
            <Icon size={20} />
          </span>
          <div>
            <p className="summary-card__value">{value}</p>
            <p className="summary-card__label">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
