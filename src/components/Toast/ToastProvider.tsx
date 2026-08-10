import { useCallback, useState, type PropsWithChildren } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { ToastContext } from './toastContext';

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

let nextId = 1;

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: Toast['type'], message: string) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.type === 'error' ? 'alert' : 'status'}
            className={`toast toast--${toast.type}`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} aria-hidden="true" />
            ) : (
              <XCircle size={18} aria-hidden="true" />
            )}
            <span>{toast.message}</span>
            <button
              type="button"
              className="toast__close"
              aria-label="Cerrar notificación"
              onClick={() => dismiss(toast.id)}
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
