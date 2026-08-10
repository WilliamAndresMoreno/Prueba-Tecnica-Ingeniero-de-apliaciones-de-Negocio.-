import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useStationServices } from './useStationServices';
import { TestQueryProvider } from '@/test/test-utils';
import * as api from '@/services/api';

// Mock de la capa de servicios: el hook no debe depender de la
// implementación real (latencia, in-memory db), solo del contrato.
vi.mock('@/services/api', () => ({
  fetchStationServices: vi.fn(),
}));

const mockedFetchStationServices = vi.mocked(api.fetchStationServices);

describe('useStationServices', () => {
  beforeEach(() => {
    mockedFetchStationServices.mockReset();
  });

  it('no ejecuta el fetch si no hay stationId (enabled: false)', () => {
    const { result } = renderHook(() => useStationServices(null), {
      wrapper: TestQueryProvider,
    });

    expect(mockedFetchStationServices).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('retorna los servicios mockeados para una estación', async () => {
    mockedFetchStationServices.mockResolvedValueOnce([
      { id: 's1', name: 'Baño' },
      { id: 's2', name: 'Cajeros' },
    ]);

    const { result } = renderHook(() => useStationServices('001'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      { id: 's1', name: 'Baño' },
      { id: 's2', name: 'Cajeros' },
    ]);
    expect(mockedFetchStationServices).toHaveBeenCalledWith(
      '001',
      expect.objectContaining({ signal: expect.anything() }),
    );
  });

  it('expone isError cuando el service falla', async () => {
    mockedFetchStationServices.mockRejectedValueOnce(new Error('network down'));

    const { result } = renderHook(() => useStationServices('001'), {
      wrapper: TestQueryProvider,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('network down');
  });

  it('vuelve a pedir datos cuando cambia el stationId (fix del bug de deps vacías)', async () => {
    mockedFetchStationServices.mockResolvedValueOnce([{ id: 's1', name: 'Baño' }]);

    const { result, rerender } = renderHook(
      ({ stationId }: { stationId: string }) => useStationServices(stationId),
      { wrapper: TestQueryProvider, initialProps: { stationId: '001' } },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedFetchStationServices).toHaveBeenCalledTimes(1);

    mockedFetchStationServices.mockResolvedValueOnce([{ id: 's4', name: 'Tienda' }]);
    rerender({ stationId: '004' });

    await waitFor(() =>
      expect(result.current.data).toEqual([{ id: 's4', name: 'Tienda' }]),
    );
    expect(mockedFetchStationServices).toHaveBeenCalledTimes(2);
    expect(mockedFetchStationServices).toHaveBeenLastCalledWith(
      '004',
      expect.objectContaining({ signal: expect.anything() }),
    );
  });
});
