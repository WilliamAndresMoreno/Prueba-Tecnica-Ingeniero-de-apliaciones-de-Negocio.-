import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStationStatus } from '@/services/api';
import { queryKeys } from '@/services/queryKeys';
import type { Station, UpdateStationStatusInput } from '@/types';

/**
 * Cambia el estado operativo (activa/inactiva) de una estación.
 *
 * Usa actualización optimista: la UI refleja el cambio de inmediato
 * (mejor percepción de velocidad) y hace rollback automático si la
 * petición falla, restaurando el snapshot previo del cache.
 */
export function useUpdateStationStatus() {
  const queryClient = useQueryClient();
  const listKey = queryKeys.stations.list();

  return useMutation({
    mutationFn: (input: UpdateStationStatusInput) => updateStationStatus(input),

    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: listKey });

      const previousStations = queryClient.getQueryData<Station[]>(listKey);

      queryClient.setQueryData<Station[]>(listKey, (old) =>
        old?.map((station) =>
          station.stationId === input.stationId
            ? { ...station, status: input.status }
            : station,
        ),
      );

      return { previousStations };
    },

    onError: (_error, _input, context) => {
      if (context?.previousStations) {
        queryClient.setQueryData(listKey, context.previousStations);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
}
