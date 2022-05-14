import { useContext, useEffect } from "react";
import { AuthContext } from "@context/AuthContext";
import { useRouter } from "next/router";

interface props {
  children: React.ReactNode | React.ReactNode[];
}

export default function AuthLayout({ children }: props) {
  const { AuthData } = useContext(AuthContext);

  const router = useRouter();

  const checkLogin = () => {
    if (!AuthData.loading && (AuthData.user || AuthData.is_logged)) {
      router.push("/");
    }
  };

  useEffect(() => {
    checkLogin();
  }, [AuthData.loading]);

  return (
    <>
      {!AuthData.loading && !AuthData.is_logged && (
        <>
          <div className={``} id="auth-layout"></div>
          <div className="z-20">{children}</div>
        </>
      )}
    </>
  );
}
