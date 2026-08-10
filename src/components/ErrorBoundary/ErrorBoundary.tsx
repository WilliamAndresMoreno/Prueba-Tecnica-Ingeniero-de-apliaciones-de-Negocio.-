import { Component, type ErrorInfo, type PropsWithChildren } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary de nivel de aplicación.
 *
 * React solo puede capturar errores de renderizado con un componente de
 * clase (no hay equivalente en hooks todavía). Si algo falla de forma
 * inesperada en el árbol de componentes, esto evita una pantalla en
 * blanco y le da al usuario una forma de recuperarse sin perder toda
 * la sesión del navegador.
 */
export class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // En un proyecto real, aquí se reportaría a un servicio de
    // monitoreo (Sentry, Datadog, etc.).
    console.error('ErrorBoundary capturó un error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary" role="alert">
          <div className="error-boundary__icon" aria-hidden="true">
            <AlertOctagon size={28} />
          </div>
          <h1 className="error-boundary__title">Algo salió mal</h1>
          <p className="error-boundary__description">
            Ocurrió un error inesperado al mostrar esta sección. Puedes intentar
            recargar la vista sin perder tu sesión.
          </p>
          <button type="button" className="error-boundary__button" onClick={this.handleReset}>
            <RotateCcw size={16} aria-hidden="true" />
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
