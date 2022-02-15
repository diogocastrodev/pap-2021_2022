import { searchGlobalState } from "@src/context/SearchContext";
import { useHookstate } from "@hookstate/core";
import { gql } from "@apollo/client";
import TextInput from "../components/Form/Inputs/TextInput";
import SearchOptions from "../components/Search/SearchOptions";

/* TODO: Fix This bullshit */
const searchByProductQuery = gql`
  query searchByProduct($search: String!) {
    productByID(search: $search) {
      id
      title
    }
  }
`;

export default function SearchPage() {
  const searchState = useHookstate(searchGlobalState);
  return (
    <div className="">
      <SearchOptions />
    </div>
  );
}
