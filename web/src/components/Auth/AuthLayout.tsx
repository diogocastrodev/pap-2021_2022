import { useContext, useEffect } from "react";
import { AuthContext } from "@context/AuthContext";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import Link from "next/link";

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
          <div
            className={`fixed top-6 left-6 flex flex-row items-center text-blue-500 hover:text-blue-600 z-50`}
          >
            <Link href={`/`}>
              <div className="cursor-pointer flex items-center">
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="ml-1">Voltar</span>
              </div>
            </Link>
          </div>
          <div className="z-20">{children}</div>
        </>
      )}
    </>
  );
}
