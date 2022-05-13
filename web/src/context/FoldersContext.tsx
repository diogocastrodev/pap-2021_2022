import { gql } from "@apollo/client";
import { folderChildrenFragment } from "@src/graphql/fragments";
import { ExportedData, ReturnFolders } from "@src/graphql/graphql";
import { gqlClient } from "@src/libs/graphql-request";
import { createContext, useEffect, useState } from "react";

interface props {
  children: React.ReactNode | React.ReactNode[] | undefined;
}

type folderType = {
  lastUpdate: Date;
  loading: boolean;
  folders: ExportedData[] | undefined | [];
  straightFolders: ExportedData[] | undefined | [];
};

/* Set the ContextTypes */
type ContextType = {
  folderData: folderType;
  refreshFolders: () => void;
};

const getFoldersMutation = gql`
  ${folderChildrenFragment}
  query userFolders {
    userFolders {
      ...children
    }
  }
`;

/* Default Context, in case we don't use the Provider */
// @ts-expect-error
const FoldersContext = createContext<ContextType>({});

/* Context Provider */
const FoldersProvider = ({ children }: props) => {
  /* Store all User Data */
  const [folderData, setFolderData] = useState<folderType>({
    lastUpdate: new Date(),
    folders: undefined,
    straightFolders: undefined,
    loading: true,
  });

  const straightFolders = (data: ExportedData[]) => {
    let folders: ExportedData[] = [];
    if (data) {
      const runFolders = (fold: ExportedData[]) => {
        fold.forEach((folder) => {
          folders.push(folder as ExportedData);
          if (folder.children && folder.children.length > 0) {
            runFolders(folder.children as ExportedData[]);
          }
        });
      };
      runFolders(data as ExportedData[]);
    }
    return folders;
  };

  const refreshFolders = async () => {
    /* Temporary storage for user info */
    var values: ReturnFolders = {
      folders: [],
    };
    /* Call GraphQL API */
    await gqlClient
      .request(getFoldersMutation)
      .then((res) => {
        values.folders = res.userFolders as ExportedData[];
      })
      .catch((err) => {
        values.folders = [];
      });
    /* Store all the data on the state */
    setFolderData({
      lastUpdate: new Date(),
      // @ts-expect-error
      folders: values.folders,
      straightFolders: straightFolders(values.folders as ExportedData[]),
      loading: false,
    });
  };

  const autoRefreshSwitch = true;

  /* const interval = setInterval(async () => {
    if (autoRefreshSwitch) {
      console.log("Refreshing Folders...");
      await refreshFolders();
    }
  }, 5000); */

  /* Run every time opens any page */
  useEffect(() => {
    /* Get user Data */
    refreshFolders();
  }, []);

  return (
    <FoldersContext.Provider value={{ folderData, refreshFolders }}>
      {children}
    </FoldersContext.Provider>
  );
};

export { FoldersContext, FoldersProvider };
