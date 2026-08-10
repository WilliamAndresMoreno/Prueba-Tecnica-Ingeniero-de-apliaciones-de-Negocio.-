import type {
  Station,
  StationOperationalStatus,
  StationService,
  UpdateStationStatusInput,
} from '@/types';
import {
  servicesCatalogSeed,
  stationServiceLinksSeed,
  stationsSeed,
} from './mockData';

/**
 * Capa `services/`: es la ÚNICA parte de la app que "sabe" que hoy no hay
 * un backend real. Si mañana se reemplaza por `fetch('/api/stations')`
 * contra el CMS real, solo este archivo cambia — hooks, componentes y
 * páginas siguen intactos porque dependen de estas firmas, no de la
 * implementación. Esto es justamente lo que se documenta en
 * docs/DECISIONES_TECNICAS.md sobre cómo aislar el impacto de cambios
 * de contrato con backend/CMS.
 */

// "Base de datos" en memoria para simular persistencia entre llamadas.
let stationsDb: Station[] = stationsSeed.map((s) => ({ ...s }));

const LATENCY_MS = 450;

/** Simula latencia real de red y respeta cancelación vía AbortSignal. */
function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);

    if (signal) {
      if (signal.aborted) {
        clearTimeout(timeout);
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timeout);
          reject(new DOMException('Aborted', 'AbortError'));
        },
        { once: true },
      );
    }
  });
}

export interface FetchOptions {
  signal?: AbortSignal;
}

/** GET /stations — lista todas las estaciones. */
export async function fetchStations({ signal }: FetchOptions = {}): Promise<Station[]> {
  await delay(LATENCY_MS, signal);
  return stationsDb.map((s) => ({ ...s }));
}

/** GET /stations/:stationId/services — servicios habilitados para una estación. */
export async function fetchStationServices(
  stationId: string,
  { signal }: FetchOptions = {},
): Promise<StationService[]> {
  if (!stationId) return [];

  await delay(LATENCY_MS, signal);

  const linkedServiceIds = stationServiceLinksSeed
    .filter((link) => link.stationId === stationId)
    .map((link) => link.serviceId);

  return servicesCatalogSeed
    .filter((service) => linkedServiceIds.includes(service.id))
    .map((service) => ({ id: service.id, name: service.name }));
}

/** PATCH /stations/:stationId/status — activa/inactiva una estación. */
export async function updateStationStatus(
  { stationId, status }: UpdateStationStatusInput,
  { signal }: FetchOptions = {},
): Promise<Station> {
  await delay(LATENCY_MS, signal);

  const station = stationsDb.find((s) => s.stationId === stationId);
  if (!station) {
    throw new Error(`Estación con stationId "${stationId}" no encontrada`);
  }

  station.status = status as StationOperationalStatus;
  stationsDb = stationsDb.map((s) => (s.stationId === stationId ? { ...station } : s));

  return { ...station };
}

/** Utilidad exclusiva de tests: restaura el estado inicial del store en memoria. */
export function __resetStationsDbForTests(): void {
  stationsDb = stationsSeed.map((s) => ({ ...s }));
}
