import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { StationsPage } from '@/pages/StationsPage';
import { ConfirmDialog } from '@/components/ConfirmDialog/ConfirmDialog';
import { StationCard } from '@/components/StationList/StationCard';
import { TestAppProviders } from '@/test/test-utils';
import * as api from '@/services/api';

/**
 * Suite de accesibilidad automatizada.
 *
 * axe-core corre reglas WCAG 2.x sobre el DOM ya renderizado (roles ARIA,
 * contraste declarado en el markup, labels de formulario, estructura de
 * encabezados, etc.). No reemplaza una revisión manual con lector de
 * pantalla, pero atrapa regresiones estructurales antes de que lleguen a
 * producción — por ejemplo, un botón sin label o un modal sin
 * aria-labelledby.
 */

vi.mock('@/services/api', () => ({
  fetchStations: vi.fn(),
  fetchStationServices: vi.fn(),
  updateStationStatus: vi.fn(),
}));

const mocked = vi.mocked(api);

beforeEach(() => {
  vi.clearAllMocks();
  window.history.replaceState({}, '', '/');
  mocked.fetchStations.mockResolvedValue([
    { id: 1, name: 'Estación Prueba 1', stationId: '001', status: 'active' },
    { id: 2, name: 'Estación Prueba 2', stationId: '002', status: 'inactive' },
  ]);
  mocked.fetchStationServices.mockResolvedValue([{ id: 's1', name: 'Baño' }]);
});

describe('Accesibilidad (axe)', () => {
  it('la página completa no tiene violaciones detectables', async () => {
    const { container } = render(<StationsPage />, { wrapper: TestAppProviders });

    await waitFor(() =>
      expect(screen.getByText('Estación Prueba 1')).toBeInTheDocument(),
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('el modal de confirmación no tiene violaciones detectables', async () => {
    const { container } = render(
      <ConfirmDialog
        open
        tone="danger"
        title="¿Inactivar esta estación?"
        description="Estación Prueba 1 dejará de mostrarse como activa."
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('una tarjeta de estación no tiene violaciones detectables', async () => {
    const { container } = render(
      <ul>
        <StationCard
          station={{ id: 1, name: 'Estación Prueba 1', stationId: '001', status: 'active' }}
          isSelected={false}
          onSelect={() => {}}
          onToggleStatus={() => {}}
        />
      </ul>,
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
