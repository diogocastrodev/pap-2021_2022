import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { routes } from "@src/functions/routes";
import { folderChildrenFragment } from "@src/graphql/fragments";
import { ExportedData, Folders, ReturnFolders } from "@src/graphql/graphql";
import { gqlClient } from "@src/libs/graphql-request";
import { createContext, useEffect, useState } from "react";

interface props {
  children: React.ReactNode | React.ReactNode[] | undefined;
}

type folderType = {
  lastUpdate: Date;
  loading: boolean;
  folders: ExportedData[] | undefined | [];
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
      folders {
        ...children
      }
      folders_amount
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
    loading: true,
  });

  const refreshFolders = async () => {
    /* Temporary storage for user info */
    var values: ReturnFolders = {
      folders: [],
      folders_amount: 0,
    };
    /* Call GraphQL API */
    await gqlClient
      .request(getFoldersMutation)
      .then((res) => {
        values = res.userFolders as ReturnFolders;
      })
      .catch((err) => {
        values.folders_amount = 0;
        values.folders = [];
      });
    /* Store all the data on the state */
    setFolderData({
      lastUpdate: new Date(),
      // @ts-expect-error
      folders: values.folders,
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
