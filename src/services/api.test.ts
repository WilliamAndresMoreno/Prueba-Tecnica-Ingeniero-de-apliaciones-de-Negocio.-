import { describe, expect, it, beforeEach } from 'vitest';
import {
  fetchStations,
  fetchStationServices,
  updateStationStatus,
  __resetStationsDbForTests,
} from './api';

describe('services/api', () => {
  beforeEach(() => {
    __resetStationsDbForTests();
  });

  it('fetchStations retorna las 4 estaciones semilla', async () => {
    const stations = await fetchStations();
    expect(stations).toHaveLength(4);
    expect(stations[0]).toMatchObject({ stationId: '001', name: 'Estación Prueba 1' });
  });

  it('fetchStationServices resuelve el join estación->servicio correctamente', async () => {
    const services = await fetchStationServices('001');
    expect(services.map((s) => s.id).sort()).toEqual(['s1', 's2']);
  });

  it('fetchStationServices retorna vacío para una estación sin servicios', async () => {
    const services = await fetchStationServices('999');
    expect(services).toEqual([]);
  });

  it('updateStationStatus persiste el cambio para llamadas subsecuentes', async () => {
    const updated = await updateStationStatus({ stationId: '003', status: 'active' });
    expect(updated.status).toBe('active');

    const stations = await fetchStations();
    const station003 = stations.find((s) => s.stationId === '003');
    expect(station003?.status).toBe('active');
  });

  it('updateStationStatus lanza error si la estación no existe', async () => {
    await expect(
      updateStationStatus({ stationId: '999', status: 'active' }),
    ).rejects.toThrow(/no encontrada/);
  });

  it('respeta la cancelación vía AbortController', async () => {
    const controller = new AbortController();
    const promise = fetchStations({ signal: controller.signal });
    controller.abort();

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' });
  });
});
