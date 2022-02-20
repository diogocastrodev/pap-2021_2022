import { gql, useQuery } from "@apollo/client";
import { folderFragment } from "@src/graphql/fragments";
import Tree from "../../components/Tree/Tree";

const getFolders = gql`
  ${folderFragment}
  query userFolders {
    userFolders {
      folders {
        ...children
      }
      folders_amount
    }
  }
`;

export default function DashboardPage() {
  const { loading, error, data } = useQuery(getFolders);
  if (loading) return <p>Loading...</p>;
  return (
    <>
      <div>
        <Tree folders={data.userFolders.folders} />
      </div>
    </>
  );
}
