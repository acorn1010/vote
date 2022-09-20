// src/pages/_app.tsx
import { SessionProvider } from 'next-auth/react';
import type { AppType } from 'next/dist/shared/lib/utils';
import { Navbar } from '../components/navigation/Navbar';
import { PageHeader } from '../components/PageHeader';
import '../styles/globals.css';
import { trpc } from '../utils/trpc';

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={60 * 60}
    >
      <PageHeader />
      <Navbar />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
