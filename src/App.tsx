import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppRouter from '@/router';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </HelmetProvider>
  );
}
