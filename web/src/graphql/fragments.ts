import { gql } from "@apollo/client";

export const folderFragment = gql`
  fragment folderData on Folders {
    folder_id
    color
    color_style
    name
  }
`;

export const folderChildrenFragment = gql`
  fragment folderData on exportedData {
    folder_id
    color
    color_style
    name
  }

  fragment children on exportedData {
    ...folderData
    children {
      ...folderData
      children {
        ...folderData
        children {
          ...folderData
          children {
            ...folderData
            children {
              ...folderData
              children {
                ...folderData
                children {
                  ...folderData
                }
              }
            }
          }
        }
      }
    }
  }
`;
