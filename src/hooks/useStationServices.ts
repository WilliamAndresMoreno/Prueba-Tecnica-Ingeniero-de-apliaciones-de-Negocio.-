import { useQuery } from '@tanstack/react-query';
import { fetchStationServices } from '@/services/api';
import { queryKeys } from '@/services/queryKeys';

/**
 * Servicios habilitados para una estación puntual.
 *
 * Este hook es la corrección directa del bug propuesto en la prueba:
 *
 *   useEffect(() => { fetchContent(stationId); }, []);
 *
 * Problemas originales y cómo se resuelven aquí:
 *  1) Deps vacías -> nunca vuelve a pedir datos si `stationId` cambia.
 *     Aquí `stationId` forma parte de la queryKey, así que un cambio
 *     de estación dispara automáticamente un nuevo fetch.
 *  2) Fetch duplicado / condiciones de carrera al cambiar rápido de
 *     estación -> React Query cancela vía `signal` la petición anterior
 *     y garantiza que el estado final corresponde siempre a la última
 *     estación seleccionada, sin necesidad de flags manuales.
 *  3) `enabled` evita disparar la query cuando aún no hay estación
 *     seleccionada (equivalente al guard `if (!stationId) return`).
 *
 * Ver docs/BUGFIX.md para el detalle completo y la alternativa con
 * `useEffect` + `AbortController` puro (sin React Query).
 */
export function useStationServices(stationId: string | null) {
  return useQuery({
    queryKey: queryKeys.stationServices.byStation(stationId ?? ''),
    queryFn: ({ signal }) => fetchStationServices(stationId as string, { signal }),
    enabled: Boolean(stationId),
    staleTime: 30_000,
  });
}
