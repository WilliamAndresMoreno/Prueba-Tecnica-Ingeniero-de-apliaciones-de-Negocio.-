import { useEffect, useMemo, useState } from 'react';
import { useStations } from '@/hooks/useStations';
import { useUpdateStationStatus } from '@/hooks/useUpdateStationStatus';
import { StationList } from '@/components/StationList/StationList';
import { ServicesPanel } from '@/components/ServicesPanel/ServicesPanel';
import { Header } from '@/components/Header/Header';
import { SummaryCards } from '@/components/SummaryCards/SummaryCards';
import { StationSearch } from '@/components/StationSearch/StationSearch';
import { useToast } from '@/components/Toast/toastContext';

const URL_PARAM = 'station';

function getStationIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(URL_PARAM);
}

export function StationsPage() {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(
    getStationIdFromUrl,
  );
  const [search, setSearch] = useState('');

  const stationsQuery = useStations();
  const updateStatusMutation = useUpdateStationStatus();
  const { showToast } = useToast();

  // Deep-linking: mantiene la estación seleccionada sincronizada con la URL
  // (?station=001), para que el enlace se pueda compartir o refrescar sin
  // perder la selección.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedStationId) {
      url.searchParams.set(URL_PARAM, selectedStationId);
    } else {
      url.searchParams.delete(URL_PARAM);
    }
    window.history.replaceState({}, '', url);
  }, [selectedStationId]);

  const selectedStation = stationsQuery.data?.find(
    (s) => s.stationId === selectedStationId,
  );

  const filteredStations = useMemo(() => {
    const stations = stationsQuery.data ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return stations;
    return stations.filter(
      (s) =>
        s.name.toLowerCase().includes(term) || s.stationId.toLowerCase().includes(term),
    );
  }, [stationsQuery.data, search]);

  const handleToggleStatus = (stationId: string) => {
    const station = stationsQuery.data?.find((s) => s.stationId === stationId);
    if (!station) return;

    const nextStatus = station.status === 'active' ? 'inactive' : 'active';

    updateStatusMutation.mutate(
      { stationId, status: nextStatus },
      {
        onSuccess: () => {
          showToast(
            'success',
            `${station.name} ahora está ${nextStatus === 'active' ? 'activa' : 'inactiva'}.`,
          );
        },
        onError: () => {
          showToast('error', `No se pudo actualizar el estado de ${station.name}.`);
        },
      },
    );
  };

  return (
    <div className="app-shell">
      <Header />

      <main className="stations-page">
        <p className="stations-page__intro">
          Selecciona una estación para consultar los servicios que ofrece.
        </p>

        <SummaryCards stations={stationsQuery.data ?? []} />

        <div className="stations-page__grid">
          <section aria-labelledby="stations-heading">
            <div className="stations-page__section-header">
              <h2 id="stations-heading">Estaciones</h2>
              <StationSearch value={search} onChange={setSearch} />
            </div>
            <StationList
              stations={filteredStations}
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
              isFiltered={search.trim().length > 0}
            />
          </section>

          <ServicesPanel stationId={selectedStationId} stationName={selectedStation?.name} />
        </div>
      </main>
    </div>
  );
}
