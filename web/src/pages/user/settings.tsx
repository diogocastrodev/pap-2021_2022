import { gql, useMutation } from "@apollo/client";
import { UploadIcon } from "@heroicons/react/solid";
import UserAvatar from "@src/components/user/items/Avatar/UserAvatar";
import { AuthContext } from "@src/context/AuthContext";
import { config, graphQL_Endpoint } from "@src/global/variables";
import { accessGlobalState } from "@src/libs/Apollo";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Input from "../../components/Form/Inputs/Input";

const uploadImageMutation = gql`
  mutation ($file: Upload!) {
    uploadUserImage(file: $file)
  }
`;

export default function SettingsPage() {
  const [uploadImage] = useMutation(uploadImageMutation);
  const user = useContext(AuthContext);
  const router = useRouter();
  const [AvatarFile, setAvatarFile] = useState<FileList | null>();
  if (!user.AuthData.is_logged || !user.AuthData.user) {
    return <div>You are not logged in</div>;
  }

  return (
    <div className="mt-4 flex justify-center">
      <div className="container">
        <div className="text-2xl ">Settings</div>
        <div className="mt-6">
          <div className="">
            <div className="text-lg">User Profile</div>
            <UserAvatar className="w-24 h-24 cursor-default relative mt-2" />
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (AvatarFile) {
                  const formData = new FormData();

                  formData.append("avatar", AvatarFile[0]);

                  axios({
                    method: "POST",
                    url: `${config.API.protocol}://${config.API.URL}/upload/avatar`,
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
              }}
            >
              <Input
                type="file"
                color="default"
                onChange={(e) => setAvatarFile(e.target.files)}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
