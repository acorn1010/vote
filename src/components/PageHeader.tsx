import Head from 'next/head';

export function PageHeader() {
  return (
    <Head>
      <title>Vote</title>
      <meta
        name="description"
        content="Poll and question app. By Acorn1010. twitch.tv/acorn1010"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
