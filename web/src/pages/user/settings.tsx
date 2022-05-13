import { gql } from "@apollo/client";
import SettingsPageLayout from "@src/components/Settings/SettingsPageLayout";
import UserAvatar from "@src/components/user/items/Avatar/UserAvatar";
import { AuthContext } from "@src/context/AuthContext";
import { config } from "@src/global/variables";
import { accessGlobalState } from "@src/libs/Apollo";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Input from "../../components/Form/Inputs/Input";
import AvatarInput from "../../components/Settings/AvatarInput";

const uploadImageMutation = gql`
  mutation ($file: Upload!) {
    uploadUserImage(file: $file)
  }
`;

export default function SettingsPage() {
  const user = useContext(AuthContext);
  const router = useRouter();
  const [AvatarFile, setAvatarFile] = useState<FileList | null>();
  if (!user.AuthData.is_logged || !user.AuthData.user) {
    return <div>You are not logged in</div>;
  }

  return (
    <SettingsPageLayout>
      <div></div>
    </SettingsPageLayout>
  );
}
