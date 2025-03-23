import '../app/globals.css';
import type { AppProps } from 'next/app';
import StoreProvider from '../app/StoreProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp;