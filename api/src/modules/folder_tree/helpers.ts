import { ExportedData, Folders } from "../../graphql/types";

export const createDataTree = (dataset: Folders[]): ExportedData[] => {
  let hashTable = Object.create(null);
  dataset.forEach(
    (aData) => (hashTable[aData.folder_id] = { ...aData, children: [] })
  );
  let dataTree: ExportedData[] = [];
  dataset.forEach((aData) => {
    if (aData.parent_id)
      hashTable[aData.parent_id].children.push(hashTable[aData.folder_id]);
    else dataTree.push(hashTable[aData.folder_id]);
  });
  return dataTree;
};

function getDepthMid(array: any[]): number {
  return (
    1 + Math.max(0, ...array.map(({ children = [] }) => getDepthMid(children)))
  );
}

export function getDepth(array: any[]): number {
  return getDepthMid(array) - 1;
}
