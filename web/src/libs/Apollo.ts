import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createState, State } from "@hookstate/core";
import { graphQL_Endpoint } from "../global/variables";
import { createUploadLink } from 'apollo-upload-client';

const tokenFromLocalStorage = typeof window !== "undefined" ? localStorage.getItem("token") as string : ''

const TOKEN = createState(tokenFromLocalStorage);

const wrapState = (s: State<string>) => ({
  get: () => s.value,
  set: (token: string) => s.set(token)
})

export const accessGlobalState = () => wrapState(TOKEN)

const options = {
  uri: `${graphQL_Endpoint}`,
  headers: {
    authorization: accessGlobalState().get() ? `Bearer ${accessGlobalState().get()}` : "",
  },
};

export const client = new ApolloClient({
  ssrMode: typeof window === "undefined",
  link: createUploadLink(options),
  cache: new InMemoryCache(),
})


/* -------------------------------------------------------------------------- */
/*                                  Old Code                                  */
/* -------------------------------------------------------------------------- */
/* const httpLink = ApolloLink.split(
  operation => operation.getContext().hasUpload,
  createUploadLink(options),
  new BatchHttpLink(options)
  );


const httpLink = createHttpLink({
  uri: graphQL_Endpoint,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: accessGlobalState().get() ? `Bearer ${accessGlobalState().get()}` : "",
      formData: createUploadLink()
    },
  };
});

let apolloClient: ApolloClient<NormalizedCacheObject>;

export function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: httpLink,
    cache: new InMemoryCache()
  });
}

export function initializeApollo(initialState: any) {
    const _apolloClient = apolloClient ?? createApolloClient();

    // If your page has Next.js data fetching methods that use Apollo Client,
    // the initial state gets hydrated here
    if (initialState) {
      // Get existing cache, loaded during client side data fetching
      const existingCache = _apolloClient.extract();

      // Restore the cache using the data passed from
      // getStaticProps/getServerSideProps combined with the existing cached data
      _apolloClient.cache.restore({ ...existingCache, ...initialState });
    }

    // For SSG and SSR always create a new Apollo Client
    if (typeof window === "undefined") return _apolloClient;

    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient;
    return _apolloClient;
  }

  export function useApollo(initialState: null | undefined) {
    const store = useMemo(() => initializeApollo(initialState), [initialState]);
    return store;
  } */