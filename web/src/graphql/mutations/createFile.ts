/*
 * Using: Graphql-Request
 */

import { gql } from "@apollo/client";
import { CreateFileInput, FileType } from "@graphql/graphql";
import { routes } from "@functions/routes";
import { graphQL_request_Client } from "@libs/graphql-request";

interface props extends CreateFileInput {
  redirect?: boolean; // Default: true
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
  redirect = true,
}: props): Promise<response> {
  /*
   * TODO: Add Types and error handling
   */

  const data = await graphQL_request_Client
    .request(mutation, {
      data: {
        folder_id,
        name,
        fileType,
      },
    })
    .then((res) => res.createFile);

  if (redirect) {
    /* TODO: Router from NextJS -> most responsive */
    routes.redirect(`/dashboard/i/${data.folder_id}`);
  }

  return data;

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
