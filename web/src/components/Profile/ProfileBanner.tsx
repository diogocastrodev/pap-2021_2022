import { UserIcon } from "@heroicons/react/solid";
import { config } from "@src/global/variables";
import UserAvatar from "../user/items/Avatar/UserAvatar";

interface props {
  avatar: {
    hasAvatar: boolean;
    userId?: string;
  };
  sizes: string;
}

export default function ProfileBanner(props: props) {
  return (
    <div className={`rounded-full ${props.sizes}`}>
      {props.avatar.hasAvatar ? (
        <img
          src={`${config.CDN.protocol}://${config.CDN.URL}/img/avatar/${props.avatar.userId}`}
          className="rounded-full object-cover box-border min-w-full min-h-full w-full h-full bg-bgWhite "
        />
      ) : (
        <div className="flex justify-center items-center w-full h-full shadow-md rounded-full">
          <UserIcon className="w-2/3" />
        </div>
      )}
    </div>
  );
}

/*       
<div className="w-full h-56 bg-white rounded-md shadow-md">
    {props.banner.hasBanner && <div>Banner</div>}
</div> 
*/
