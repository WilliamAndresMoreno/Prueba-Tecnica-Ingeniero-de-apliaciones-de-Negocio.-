import { useState } from 'react';
import { Fuel, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/Theme/themeContext';

/**
 * Espacio de marca del header.
 *
 * El logo se carga desde `public/brand/terpel-logo.png` (fuera del
 * bundle de JS, servido tal cual por Vite). Si ese archivo llegara a
 * faltar o fallar al cargar, el <img> hace fallback automático a un
 * ícono genérico — la app nunca se rompe por su ausencia. Ver
 * `public/brand/README.md` para reemplazar el archivo por otra versión
 * del logo si hace falta.
 */
const LOGO_SRC = '/brand/terpel-logo.png';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <header className="app-header">
      <div className="app-header__brand">
        {!logoFailed ? (
          <img
            src={LOGO_SRC}
            alt="Logo de la organización"
            className="app-header__logo"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span className="app-header__logo app-header__logo--fallback" aria-hidden="true">
            <Fuel size={22} strokeWidth={2.2} />
          </span>
        )}
        <div>
          <p className="app-header__eyebrow">Dirección Canales Digitales</p>
          <h1 className="app-header__title">Contenido por Estación</h1>
        </div>
      </div>

      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
        title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
      >
        {theme === 'light' ? (
          <Moon size={18} aria-hidden="true" />
        ) : (
          <Sun size={18} aria-hidden="true" />
        )}
      </button>
    </header>
  );
}
