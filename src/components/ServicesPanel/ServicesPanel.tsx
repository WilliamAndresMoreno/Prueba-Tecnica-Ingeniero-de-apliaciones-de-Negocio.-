import { useStationServices } from '@/hooks/useStationServices';
import { isServiceKey } from '@/services/mockData';
import { ServiceIcon } from './ServiceIcon';

interface ServicesPanelProps {
  stationId: string | null;
  stationName?: string;
}

export function ServicesPanel({ stationId, stationName }: ServicesPanelProps) {
  const { data: services, isPending, isError, error, isFetching } =
    useStationServices(stationId);

  if (!stationId) {
    return (
      <section aria-live="polite" className="services-panel services-panel--empty">
        <p>Selecciona una estación para ver sus servicios.</p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="services-panel-heading"
      aria-busy={isFetching}
      className="services-panel"
    >
      <h2 id="services-panel-heading">
        Servicios {stationName ? `— ${stationName}` : ''}
      </h2>

      {isPending && <p role="status">Cargando servicios…</p>}

      {isError && (
        <p role="alert" className="error-text">
          No fue posible cargar los servicios: {error.message}
        </p>
      )}

      {!isPending && !isError && services && services.length === 0 && (
        <p>Esta estación no tiene servicios asociados.</p>
      )}

      {!isPending && !isError && services && services.length > 0 && (
        <ul className="services-panel__list" aria-label="Lista de servicios disponibles">
          {services.map((service) =>
            isServiceKey(service.id) ? (
              <li key={service.id} className="services-panel__item">
                <ServiceIcon serviceId={service.id} label={service.name} />
                <span className="visually-hidden">{service.name}</span>
              </li>
            ) : null,
          )}
        </ul>
      )}
    </section>
  );
}
