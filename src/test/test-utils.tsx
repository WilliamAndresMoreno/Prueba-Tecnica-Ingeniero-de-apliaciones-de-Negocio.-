import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/Theme/ThemeProvider';
import { ToastProvider } from '@/components/Toast/ToastProvider';

/** QueryClient "silencioso" para tests: sin reintentos ni retraso de errores. */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

export function TestQueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}

/** Wrapper con todos los providers reales de la app, para tests de integración. */
export function TestAppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={createTestQueryClient()}>
      <ThemeProvider>
        <ToastProvider>{children}</ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
