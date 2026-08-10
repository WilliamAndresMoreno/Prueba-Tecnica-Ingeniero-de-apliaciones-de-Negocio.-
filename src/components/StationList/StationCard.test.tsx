import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StationCard } from './StationCard';
import type { Station } from '@/types';

const station: Station = {
  id: 1,
  name: 'Estación Prueba 1',
  stationId: '001',
  status: 'active',
};

describe('<StationCard />', () => {
  it('renderiza el nombre, el código y el estado de la estación', () => {
    render(
      <ul>
        <StationCard
          station={station}
          isSelected={false}
          onSelect={vi.fn()}
          onToggleStatus={vi.fn()}
        />
      </ul>,
    );

    expect(screen.getByText('Estación Prueba 1')).toBeInTheDocument();
    expect(screen.getByText(/Código: 001/i)).toBeInTheDocument();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('llama a onSelect con el stationId al hacer click en la tarjeta', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <ul>
        <StationCard
          station={station}
          isSelected={false}
          onSelect={onSelect}
          onToggleStatus={vi.fn()}
        />
      </ul>,
    );

    await user.click(screen.getByRole('button', { name: /Estación Prueba 1/i }));

    expect(onSelect).toHaveBeenCalledWith('001');
  });

  it('llama a onToggleStatus con el stationId al hacer click en el switch, sin disparar onSelect', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onToggleStatus = vi.fn();

    render(
      <ul>
        <StationCard
          station={station}
          isSelected={false}
          onSelect={onSelect}
          onToggleStatus={onToggleStatus}
        />
      </ul>,
    );

    await user.click(screen.getByRole('switch'));

    expect(onToggleStatus).toHaveBeenCalledWith('001');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('deshabilita el switch mientras se está actualizando el estado', () => {
    render(
      <ul>
        <StationCard
          station={station}
          isSelected={false}
          onSelect={vi.fn()}
          onToggleStatus={vi.fn()}
          isTogglingStatus
        />
      </ul>,
    );

    expect(screen.getByRole('switch')).toBeDisabled();
  });
});
