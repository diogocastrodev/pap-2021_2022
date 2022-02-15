import ProfilePageComp from "@src/components/Profile/ProfilePage";
import { AuthContext } from "@src/context/AuthContext";
import { useContext } from "react";

export default function ProfilePage() {
  const user = useContext(AuthContext);

  if (!user.AuthData.is_logged || !user.AuthData.user?.public_user_id)
    return <div>You are not logged in</div>;

  return (
    <>
      <ProfilePageComp public_id={user.AuthData.user?.public_user_id} />
    </>
  );
}
