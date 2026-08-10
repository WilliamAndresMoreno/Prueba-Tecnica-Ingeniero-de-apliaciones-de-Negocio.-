import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/services/queryClient';
import { StationsPage } from '@/pages/StationsPage';
import { ThemeProvider } from '@/components/Theme/ThemeProvider';
import { ToastProvider } from '@/components/Toast/ToastProvider';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <StationsPage />
        </ToastProvider>
      </ThemeProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
