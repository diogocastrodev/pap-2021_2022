import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import React from "react";
import { AuthProvider } from "../context/AuthContext";
import Layout from "../components/Layout/Layout";
import "@css/style.css";
import checkDarkMode from "@src/functions/checkDarkMode";
import { client } from "@src/libs/Apollo";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  checkDarkMode();
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        {router.pathname.startsWith("/auth/") ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </AuthProvider>
    </ApolloProvider>
  );
}
