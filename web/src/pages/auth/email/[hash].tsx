import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import Loader from "@src/components/Loader/Loader";
import { useEffect } from "react";

const verifyEmailMutation = gql`
  mutation verifyEmail($hash: String!) {
    verifyEmail(hash: $hash)
  }
`;

export default function VerifyEmailByHash() {
  const router = useRouter();
  const hash = router.query.hash;

  const [verifyEmail, { loading, error }] = useMutation(verifyEmailMutation);

  function execVerifyEmail(hash: string) {
    verifyEmail({ variables: { hash } }).then(() => {
      !error && router.push("/auth/login");
    });
  }

  useEffect(() => {
    if (typeof hash === "string") {
      execVerifyEmail(hash as string);
    }
  }, [hash]);

  return (
    <>
      <div className="h-full w-full flex items-center justify-center absolute">
        {loading ? (
          <Loader size="large" />
        ) : (
          <div>
            <h1 className="text-3xl font-bold">
              {error ? "Error" : "Success"}
            </h1>
          </div>
        )}
      </div>
    </>
  );
}
