import { UserIcon } from "@heroicons/react/solid";
import { AuthContext } from "@src/context/AuthContext";
import { config } from "@src/global/variables";
import { accessGlobalState } from "@src/libs/Apollo";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useRef } from "react";

export default function AvatarInput() {
  const router = useRouter();
  const user = useContext(AuthContext);
  const avatarInput = useRef<HTMLInputElement>(null);

  const updateAvatar = () => {
    if (avatarInput.current !== null && avatarInput.current.files !== null) {
      const formData = new FormData();

      formData.append("avatar", avatarInput.current.files[0]);

      axios({
        method: "POST",
        url: `${config.API.secure}://${config.API.URL}/upload/avatar`,
        headers: {
          Authorization: `Bearer ${accessGlobalState().get()}`,
        },
        data: formData,
      }).then((res) => {
        if (res.status === 200) {
          router.reload();
        }
      });
    }
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div
          className={`w-24 h-24 cursor-default relative mt-2 mb-2 bg-neutral-200 text-black rounded-full flex items-center justify-center`}
          onClick={() => {
            avatarInput.current?.click();
          }}
        >
          <div className="relative">
            {false ? (
              <img
                src={`${config.CDN.secure}://${config.CDN.URL}/img/avatar/${user.AuthData.user?.public_user_id}`}
                className="rounded-full object-cover box-border min-w-full min-h-full w-full h-full bg-bgWhite "
              />
            ) : (
              <UserIcon className="w-3/4" />
            )}
            <div className="absolute flex justify-center items-center text-center text-transparent hover:text-white hover:bg-gray-700 hover:bg-opacity-70 w-full h-full top-0 hover:cursor-pointer select-none rounded-full">
              Alterar Avatar
            </div>
          </div>
        </div>
        <input
          type="file"
          name="avatarinput"
          id="avatarinput"
          onChange={(e) => {
            updateAvatar();
          }}
          ref={avatarInput}
          className="hidden"
          accept={"image/png, image/jpeg , image/jpg"}
        />
      </div>
    </>
  );
}
