import { gql } from "@apollo/client";

export const folderFragment = gql`
  fragment data on exportedData {
    color
    color_style
    name
  }

  fragment children on exportedData {
    ...data
    children {
      ...data
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
      children {
        ...data
      }
    }
  }
`;
