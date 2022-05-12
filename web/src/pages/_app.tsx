import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import React from "react";
import { useRouter } from "next/router";

import { AuthProvider } from "@src/context/AuthContext";

import { client } from "@src/libs/Apollo";

import checkDarkMode from "@src/functions/checkDarkMode";

import Layout from "@src/components/Layout/Layout";
import "@css/style.css";
import { FoldersProvider } from "@src/context/FoldersContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <FoldersProvider>
          {router.pathname.startsWith("/auth/") ? (
            <Component {...pageProps} />
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </FoldersProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
