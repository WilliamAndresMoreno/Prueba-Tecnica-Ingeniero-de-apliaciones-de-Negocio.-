import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StationsPage } from './StationsPage';
import { TestAppProviders } from '@/test/test-utils';
import * as api from '@/services/api';

vi.mock('@/services/api', () => ({
  fetchStations: vi.fn(),
  fetchStationServices: vi.fn(),
  updateStationStatus: vi.fn(),
}));

const mocked = vi.mocked(api);

const stationsFixture = [
  { id: 1, name: 'Estación Prueba 1', stationId: '001', status: 'active' as const },
  { id: 2, name: 'Estación Prueba 2', stationId: '002', status: 'active' as const },
];

beforeEach(() => {
  vi.clearAllMocks();
  window.history.replaceState({}, '', '/');
  mocked.fetchStations.mockResolvedValue(stationsFixture);
  mocked.fetchStationServices.mockResolvedValue([{ id: 's1', name: 'Baño' }]);
});

describe('<StationsPage /> (integración)', () => {
  it('renderiza el dashboard de resumen con los conteos correctos', async () => {
    render(<StationsPage />, { wrapper: TestAppProviders });

    await waitFor(() =>
      expect(screen.getByText('Estación Prueba 1')).toBeInTheDocument(),
    );

    // Total: 2, Activas: 2, Inactivas: 0
    const values = screen.getAllByText(/^[0-9]+$/);
    expect(values.map((v) => v.textContent)).toEqual(['2', '2', '0']);
  });

  it('filtra las estaciones por nombre al escribir en el buscador', async () => {
    const user = userEvent.setup();
    render(<StationsPage />, { wrapper: TestAppProviders });

    await waitFor(() =>
      expect(screen.getByText('Estación Prueba 1')).toBeInTheDocument(),
    );

    await user.type(
      screen.getByPlaceholderText(/buscar por nombre/i),
      'Prueba 2',
    );

    expect(screen.queryByText('Estación Prueba 1')).not.toBeInTheDocument();
    expect(screen.getByText('Estación Prueba 2')).toBeInTheDocument();
  });

  it('actualiza la URL con ?station=<id> al seleccionar una estación', async () => {
    const user = userEvent.setup();
    render(<StationsPage />, { wrapper: TestAppProviders });

    await waitFor(() =>
      expect(screen.getByText('Estación Prueba 1')).toBeInTheDocument(),
    );

    await user.click(screen.getByRole('button', { name: /Estación Prueba 1/i }));

    await waitFor(() =>
      expect(window.location.search).toBe('?station=001'),
    );
  });

  it('muestra un toast de éxito al cambiar el estado de una estación', async () => {
    const user = userEvent.setup();
    mocked.updateStationStatus.mockResolvedValue({
      ...stationsFixture[0],
      status: 'inactive',
    });

    render(<StationsPage />, { wrapper: TestAppProviders });

    await waitFor(() =>
      expect(screen.getByText('Estación Prueba 1')).toBeInTheDocument(),
    );

    const switches = screen.getAllByRole('switch');
    await user.click(switches[0]);

    await waitFor(() =>
      expect(
        screen.getByText(/Estación Prueba 1 ahora está inactiva/i),
      ).toBeInTheDocument(),
    );
  });

  it('muestra un toast de error si la actualización de estado falla', async () => {
    const user = userEvent.setup();
    mocked.updateStationStatus.mockRejectedValue(new Error('network down'));

    render(<StationsPage />, { wrapper: TestAppProviders });

    await waitFor(() =>
      expect(screen.getByText('Estación Prueba 1')).toBeInTheDocument(),
    );

    const switches = screen.getAllByRole('switch');
    await user.click(switches[0]);

    await waitFor(() =>
      expect(
        screen.getByText(/No se pudo actualizar el estado de Estación Prueba 1/i),
      ).toBeInTheDocument(),
    );
  });
});
