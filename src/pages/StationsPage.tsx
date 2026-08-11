import { useEffect, useMemo, useRef, useState } from 'react';
import { useStations } from '@/hooks/useStations';
import { useUpdateStationStatus } from '@/hooks/useUpdateStationStatus';
import { StationList } from '@/components/StationList/StationList';
import { ServicesPanel } from '@/components/ServicesPanel/ServicesPanel';
import { Header } from '@/components/Header/Header';
import { SummaryCards } from '@/components/SummaryCards/SummaryCards';
import { StationSearch } from '@/components/StationSearch/StationSearch';
import { StationSort, type SortOption } from '@/components/StationSort/StationSort';
import { ExportCsvButton } from '@/components/ExportCsvButton/ExportCsvButton';
import { ConfirmDialog } from '@/components/ConfirmDialog/ConfirmDialog';
import { useToast } from '@/components/Toast/toastContext';
import type { Station } from '@/types';

const URL_PARAM = 'station';

function getStationIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get(URL_PARAM);
}

function sortStations(stations: Station[], sort: SortOption): Station[] {
  const sorted = [...stations];
  switch (sort) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'status-active-first':
      return sorted.sort((a, b) => Number(b.status === 'active') - Number(a.status === 'active'));
    case 'status-inactive-first':
      return sorted.sort((a, b) => Number(a.status === 'active') - Number(b.status === 'active'));
    default:
      return sorted;
  }
}

export function StationsPage() {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(
    getStationIdFromUrl,
  );
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('name-asc');
  const [pendingDeactivation, setPendingDeactivation] = useState<Station | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Atajo de teclado "/" para saltar directo al buscador (Esc lo limpia,
  // manejado dentro de StationSearch). No captura "/" si el foco ya está
  // en un campo de texto, para no interferir con lo que el usuario escribe.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping = ['INPUT', 'TEXTAREA'].includes(target.tagName);
      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const stations = useMemo(() => stationsQuery.data ?? [], [stationsQuery.data]);
  const selectedStation = stations.find((s) => s.stationId === selectedStationId);

  // Deep-link inválido: hay un stationId en la URL pero, una vez cargados
  // los datos, no corresponde a ninguna estación real.
  const isInvalidDeepLink = Boolean(
    !stationsQuery.isPending && selectedStationId && !selectedStation,
  );

  const visibleStations = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? stations.filter(
          (s) =>
            s.name.toLowerCase().includes(term) ||
            s.stationId.toLowerCase().includes(term),
        )
      : stations;
    return sortStations(filtered, sort);
  }, [stations, search, sort]);

  const applyStatusChange = (station: Station, nextStatus: 'active' | 'inactive') => {
    updateStatusMutation.mutate(
      { stationId: station.stationId, status: nextStatus },
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

  const handleToggleStatus = (stationId: string) => {
    const station = stations.find((s) => s.stationId === stationId);
    if (!station) return;

    if (station.status === 'active') {
      // Inactivar es la acción de mayor riesgo operativo: pide confirmación.
      setPendingDeactivation(station);
      return;
    }

    applyStatusChange(station, 'active');
  };

  return (
    <div className="app-shell">
      <Header />

      <main className="stations-page">
        <p className="stations-page__intro">
          Selecciona una estación para consultar los servicios que ofrece.
        </p>

        <SummaryCards stations={stations} />

        <div className="stations-page__grid">
          <section aria-labelledby="stations-heading">
            <div className="stations-page__section-header">
              <h2 id="stations-heading">Estaciones</h2>
              <div className="stations-page__controls">
                <StationSearch value={search} onChange={setSearch} inputRef={searchInputRef} />
                <StationSort value={sort} onChange={setSort} />
                <ExportCsvButton stations={visibleStations} />
              </div>
            </div>

            {isInvalidDeepLink && (
              <p role="alert" className="error-text" style={{ marginTop: 0 }}>
                No encontramos la estación solicitada en el enlace. Selecciona una de la
                lista.
              </p>
            )}

            <StationList
              stations={visibleStations}
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

          <ServicesPanel
            stationId={isInvalidDeepLink ? null : selectedStationId}
            stationName={selectedStation?.name}
          />
        </div>
      </main>

      <ConfirmDialog
        open={pendingDeactivation !== null}
        tone="danger"
        title="¿Inactivar esta estación?"
        description={
          pendingDeactivation
            ? `${pendingDeactivation.name} (código ${pendingDeactivation.stationId}) dejará de mostrarse como activa. Puedes reactivarla en cualquier momento.`
            : ''
        }
        confirmLabel="Sí, inactivar"
        cancelLabel="Cancelar"
        onCancel={() => setPendingDeactivation(null)}
        onConfirm={() => {
          if (pendingDeactivation) {
            applyStatusChange(pendingDeactivation, 'inactive');
          }
          setPendingDeactivation(null);
        }}
      />
    </div>
  );
}
