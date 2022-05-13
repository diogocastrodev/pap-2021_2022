/*
 * Using: Graphql-Request
 */

import { gql } from "@apollo/client";
import { Files, FileType } from "@graphql/graphql";
import { gqlClient } from "@libs/graphql-request";
import { FoldersContext } from "@src/context/FoldersContext";
import { NextRouter, useRouter } from "next/router";
import { useContext } from "react";

interface props {
  fileType: FileType;
  folderId: string;
  name: string;
  redirect?: {
    router: NextRouter;
  };
}

interface response {
  data?: {
    file_id: string;
    fileType: FileType;
    name: string;
    folder_id: string;
  };
  error?: string | undefined;
}

const mutation = gql`
  mutation newFile($fileType: FileType!, $name: String!, $folder_id: ID!) {
    createFile(fileType: $fileType, name: $name, folder_id: $folder_id) {
      file_id
      name
      fileType
      folders {
        folder_id
      }
    }
  }
`;

export default async function createFile({
  folderId,
  name,
  fileType,
  redirect,
}: props): Promise<response> {
  const data = await gqlClient
    .request(mutation, {
      folder_id: folderId,
      name,
      fileType,
    })
    .then((res) => res.createFile as Files);

  const organizedData = {
    data: {
      file_id: data.file_id,
      fileType: data.fileType,
      name: data.name,
      folder_id: data.folders!.folder_id,
    },
  };

  if (typeof redirect !== "undefined") {
    /* TODO: Router from NextJS -> most responsive */
    redirect.router.push(`/dashboard/i/${organizedData.data.file_id}`);
  }

  return organizedData;

  /* const data = await createWithMutation()
    .then((res) => {
      if (res.data.createFile) {
        const { file_id, name, fileType, folder_id } = res.data
          .createFile as Files;

        const data = {
          file_id,
          name,
          fileType,
          folder_id,
        };

        if (redirect) {
          routes.redirect(`dashboard/i/${file_id}`);
        }

        return {
          data,
          error: undefined,
        };
      }
    })
    .catch((err) => {
      return {
        error: err as string,
      };
    });

  if (!data) {
    return {
      error: "Something went wrong",
    };
  }

  return data; */
}
