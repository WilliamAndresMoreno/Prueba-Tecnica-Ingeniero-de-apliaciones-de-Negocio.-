import { describe, expect, it } from 'vitest';
import { stationsToCsv } from './csvExport';
import type { Station } from '@/types';

const stations: Station[] = [
  { id: 1, name: 'Estación Prueba 1', stationId: '001', status: 'active' },
  { id: 2, name: 'Estación, con coma', stationId: '002', status: 'inactive' },
];

describe('stationsToCsv', () => {
  it('genera el encabezado correcto', () => {
    const csv = stationsToCsv([]);
    expect(csv).toBe('Nombre,Código,Estado');
  });

  it('convierte cada estación a una fila con su estado traducido', () => {
    const csv = stationsToCsv(stations);
    const lines = csv.split('\r\n');

    expect(lines[0]).toBe('Nombre,Código,Estado');
    expect(lines[1]).toBe('Estación Prueba 1,001,Activa');
  });

  it('escapa valores que contienen comas entre comillas dobles', () => {
    const csv = stationsToCsv(stations);
    expect(csv).toContain('"Estación, con coma",002,Inactiva');
  });
});
