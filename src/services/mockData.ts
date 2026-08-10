import type {
  ServiceCatalogItem,
  ServiceKey,
  Station,
  StationServiceLink,
} from '@/types';

/**
 * Datos base entregados en el enunciado de la prueba.
 *
 * El enunciado los define con errores de sintaxis JS (comas en vez de
 * `:`) y con claves inconsistentes entre registros (`stationId` vs
 * `idEstacion`, `idServicio` vs `idServicios`). Se normalizan aquí, una
 * sola vez, para que el resto de la app trabaje siempre con un
 * contrato limpio y tipado (ver `@/types`).
 */

export const stationsSeed: Station[] = [
  { id: 1, name: 'Estación Prueba 1', stationId: '001', status: 'active' },
  { id: 2, name: 'Estación Prueba 2', stationId: '002', status: 'active' },
  { id: 3, name: 'Estación Prueba 3', stationId: '003', status: 'inactive' },
  { id: 4, name: 'Estación Prueba 4', stationId: '004', status: 'active' },
];

export const stationServiceLinksSeed: StationServiceLink[] = [
  { id: 1, stationId: '001', serviceId: 's1' },
  { id: 2, stationId: '001', serviceId: 's2' },
  { id: 3, stationId: '002', serviceId: 's1' },
  { id: 4, stationId: '003', serviceId: 's3' },
  { id: 5, stationId: '003', serviceId: 's1' },
  { id: 6, stationId: '004', serviceId: 's4' },
];

export const servicesCatalogSeed: ServiceCatalogItem[] = [
  { id: 's1', name: 'Baño' },
  { id: 's2', name: 'Cajeros' },
  { id: 's3', name: 'Soat' },
  { id: 's4', name: 'Tienda' },
];

export const isServiceKey = (value: string): value is ServiceKey =>
  ['s1', 's2', 's3', 's4'].includes(value);
