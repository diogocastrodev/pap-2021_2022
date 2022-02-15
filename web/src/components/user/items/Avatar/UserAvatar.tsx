import { UserIcon } from "@heroicons/react/solid";
import { useContext } from "react";
import { AuthContext } from "@src/context/AuthContext";
import { config } from "@src/global/variables";

interface props {
  className?: string;
}

export default function UserAvatar(props: props) {
  const user = useContext(AuthContext);
  return (
    <div
      className={`${
        props.className && props.className
      } bg-neutral-200 text-black rounded-full flex items-center justify-center`}
    >
      {user.AuthData.user?.haveAvatar ? (
        <img
          src={`${config.CDN.protocol}://${config.CDN.URL}/img/avatar/${user.AuthData.user?.public_user_id}`}
          className="rounded-full object-cover box-border min-w-full min-h-full w-full h-full bg-bgWhite "
        />
      ) : (
        <UserIcon className="w-3/4" />
      )}
    </div>
  );
}
