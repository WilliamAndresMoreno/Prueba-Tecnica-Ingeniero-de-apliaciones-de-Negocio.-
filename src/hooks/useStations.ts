import { useQuery } from '@tanstack/react-query';
import { fetchStations } from '@/services/api';
import { queryKeys } from '@/services/queryKeys';

/**
 * Lista todas las estaciones.
 *
 * React Query resuelve aquí, "gratis", los tres problemas del bug
 * original (ver docs/BUGFIX.md):
 *  - cancela la petición en curso si el componente se desmonta
 *    (usa el `signal` que le pasamos a `fetchStations`),
 *  - dedupea peticiones concurrentes con la misma queryKey,
 *  - evita condiciones de carrera: solo el último request "gana"
 *    gracias al control interno de queryKey + AbortController.
 */
export function useStations() {
  return useQuery({
    queryKey: queryKeys.stations.list(),
    queryFn: ({ signal }) => fetchStations({ signal }),
    staleTime: 60_000, // 1 min: los datos se consideran frescos y no se refetchean de más
    gcTime: 5 * 60_000, // 5 min en cache tras quedar sin observadores
  });
}
