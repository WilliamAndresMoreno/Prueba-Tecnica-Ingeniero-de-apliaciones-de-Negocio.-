import { Bath, Landmark, ShieldCheck, Store, HelpCircle, type LucideIcon } from 'lucide-react';
import type { ServiceKey } from '@/types';

/**
 * El enunciado pide explícitamente que los servicios NO se muestren
 * por nombre, sino con un ícono representativo. El nombre se conserva
 * igual como `aria-label`/`title` para que el ícono no sea una barrera
 * de accesibilidad para lectores de pantalla.
 */
const SERVICE_ICON_MAP: Record<ServiceKey, LucideIcon> = {
  s1: Bath, // Baño
  s2: Landmark, // Cajeros
  s3: ShieldCheck, // Soat
  s4: Store, // Tienda
};

interface ServiceIconProps {
  serviceId: ServiceKey;
  label: string;
}

export function ServiceIcon({ serviceId, label }: ServiceIconProps) {
  const Icon = SERVICE_ICON_MAP[serviceId] ?? HelpCircle;

  return (
    <span className="service-icon" role="img" aria-label={label} title={label}>
      <Icon size={20} strokeWidth={2} aria-hidden="true" />
    </span>
  );
}
