import { useState } from 'react';
import { useStations } from '@/hooks/useStations';
import { useUpdateStationStatus } from '@/hooks/useUpdateStationStatus';
import { StationList } from '@/components/StationList/StationList';
import { ServicesPanel } from '@/components/ServicesPanel/ServicesPanel';

export function StationsPage() {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);

  const stationsQuery = useStations();
  const updateStatusMutation = useUpdateStationStatus();

  const selectedStation = stationsQuery.data?.find(
    (s) => s.stationId === selectedStationId,
  );

  const handleToggleStatus = (stationId: string) => {
    const station = stationsQuery.data?.find((s) => s.stationId === stationId);
    if (!station) return;

    updateStatusMutation.mutate({
      stationId,
      status: station.status === 'active' ? 'inactive' : 'active',
    });
  };

  return (
    <main className="stations-page">
      <header className="stations-page__header">
        <h1>Contenido por Estación</h1>
        <p>Selecciona una estación para consultar los servicios que ofrece.</p>
      </header>

      <div className="stations-page__grid">
        <section aria-labelledby="stations-heading">
          <h2 id="stations-heading">Estaciones</h2>
          <StationList
            stations={stationsQuery.data ?? []}
            isLoading={stationsQuery.isPending}
            isError={stationsQuery.isError}
            errorMessage={stationsQuery.error?.message}
            selectedStationId={selectedStationId}
            onSelect={setSelectedStationId}
            onToggleStatus={handleToggleStatus}
            togglingStationId={
              updateStatusMutation.isPending
                ? updateStatusMutation.variables?.stationId
                : null
            }
          />
        </section>

        <ServicesPanel stationId={selectedStationId} stationName={selectedStation?.name} />
      </div>
    </main>
  );
}
