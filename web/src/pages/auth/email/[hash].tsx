import { gql } from "@apollo/client";
import { useRouter } from "next/router";
import Loader from "@src/components/Loader/Loader";
import { useEffect, useState } from "react";
import { gqlClient } from "@libs/graphql-request";
import Head from "next/head";

const verifyEmailMutation = gql`
  mutation verifyEmail($hash: String!) {
    verifyEmail(hash: $hash)
  }
`;

export default function VerifyEmailByHash() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const hash = router.query.hash;

  function execVerifyEmail(hash: string) {
    gqlClient
      .request(verifyEmailMutation, { hash })
      .then((res) => {
        if (res.verifyEmail) {
          setLoading(false);
          router.push("/auth/login");
        }
      })
      .catch((err) => {
        setError(err);
      });
  }

  useEffect(() => {
    if (typeof hash === "string") {
      execVerifyEmail(hash as string);
    }
  }, [hash || router.isReady]);

  return (
    <>
      <Head>
        <title>Verificação de email | note.so</title>
      </Head>
      <div className="h-full w-full flex items-center justify-center absolute">
        {loading ? (
          <Loader size="large" />
        ) : (
          <div>
            <h1 className="text-3xl font-bold">
              {error ? "Error" : "Success... redirecting"}
            </h1>
          </div>
        )}
      </div>
    </>
  );
}
