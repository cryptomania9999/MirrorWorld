import "../styles/globals.css";

import "../styles/Search.less";

import "antd-mobile/bundle/css-vars-patch.css";

import type { AppProps } from "next/app";

import Head from "next/head";
import { Toaster } from 'sonner';
import { MirrorWorldProvider } from '@/hooks/use-mirrorworld';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;"
        />
      </Head>
      <MirrorWorldProvider>
        <Component {...pageProps} />
      </MirrorWorldProvider>
      <Toaster richColors />
    </>
  );
}

export default MyApp;
