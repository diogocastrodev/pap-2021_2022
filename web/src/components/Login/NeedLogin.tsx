import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { AuthContext } from "@context/AuthContext";

interface props {
  children: React.ReactNode | React.ReactNode[] | undefined;
}

export default function NeedLogin({ children }: props) {
  const router = useRouter();

  const { AuthData } = useContext(AuthContext);

  useEffect(() => {
    if (!AuthData.loading && !AuthData.user && !AuthData.is_logged) {
      router.push("/auth/login");
    }
  }, [AuthData.loading || AuthData.is_logged]);

  return (
    <>
      {!AuthData.loading && AuthData.user && AuthData.is_logged && (
        <>{children}</>
      )}
    </>
  );
}
