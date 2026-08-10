/**
 * Query keys centralizadas para TanStack Query.
 * Centralizarlas evita colisiones/typos y facilita invalidar cache
 * de forma consistente desde cualquier hook.
 */
export const queryKeys = {
  stations: {
    all: ['stations'] as const,
    list: () => [...queryKeys.stations.all, 'list'] as const,
  },
  stationServices: {
    all: ['station-services'] as const,
    byStation: (stationId: string) =>
      [...queryKeys.stationServices.all, stationId] as const,
  },
};
