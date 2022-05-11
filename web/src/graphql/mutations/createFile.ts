/*
 * Using: Graphql-Request
 */

import { gql } from "@apollo/client";
import { CreateFileInput, Files, FileType } from "@graphql/graphql";
import { graphqlClient } from "@libs/graphql-request";
import { FoldersContext } from "@src/context/FoldersContext";
import { NextRouter, useRouter } from "next/router";
import { useContext } from "react";

interface props extends CreateFileInput {
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
  mutation newFile($data: createFileInput!) {
    createFile(data: $data) {
      file_id
      name
      fileType
      folder_id
    }
  }
`;

export default async function createFile({
  folder_id,
  name,
  fileType,
  redirect,
}: props): Promise<response> {
  const data = await graphqlClient
    .request(mutation, {
      data: {
        folder_id,
        name,
        fileType,
      },
    })
    .then((res) => res.createFile as Files);

  const organizedData = {
    data: {
      file_id: data.file_id,
      fileType: data.fileType,
      name: data.name,
      folder_id: data.folder_id,
    },
  };

  if (typeof redirect !== "undefined") {
    /* TODO: Router from NextJS -> most responsive */
    redirect.router.push(`/dashboard/i/${data.folder_id}`);
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
