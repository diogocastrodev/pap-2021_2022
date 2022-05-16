import { useContext, useEffect } from "react";
import { AuthContext } from "@context/AuthContext";
import NeedLogin from "@components/Login/NeedLogin";

export default function Logout() {
  const { logout } = useContext(AuthContext);
  useEffect(() => {
    logout();
  }, []);

  return (
    <>
      <NeedLogin>
        <div>A sair...</div>
      </NeedLogin>
    </>
  );
}
