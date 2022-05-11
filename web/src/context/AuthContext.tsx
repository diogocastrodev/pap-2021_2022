import { gql, useMutation } from "@apollo/client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../graphql/graphql";
import { graphqlClient } from "../libs/graphql-request";
import { accessGlobalState } from "../libs/Apollo";
import { routes } from "../functions/routes";

/* Context.Provider children */
type Props = {
  children: ReactNode;
};

/* AuthData Type */
export type AuthType = {
  loading?: boolean;
  is_logged?: boolean | undefined;
  user?: User;
};

/* Login Mutation */
const loginMutation = gql`
  mutation login($data: LoginInput!) {
    login(data: $data)
  }
`;

/* GetUser query */
const getUserQuery = gql`
  query user {
    me {
      public_user_id
      email
    }
    checkToken
  }
`;

/* Set the ContextTypes */
type ContextType = {
  AuthData: AuthType;
  login: (EmailUsername: string, password: string) => Promise<void>;
  logout: () => void;
};

/* Default Context, in case we don't use the Provider */
// @ts-expect-error
const AuthContext = createContext<ContextType>({ AuthData: {} });

/* Context Provider */
const AuthProvider = ({ children }: Props) => {
  /* Store all User Data */
  const [AuthData, setAuthData] = useState<AuthType>({ loading: true });
  /* create a mutation Function to Login */
  const [loginFunction] = useMutation(loginMutation);
  /* Access token */
  const token = accessGlobalState();

  const getUserData = async () => {
    /* Temporary storage for user info */
    const values: AuthType = {};
    /* Call GraphQL API */
    await graphqlClient
      .request(getUserQuery)
      .then((res) => {
        /* Set the is_logged according to token if valid */
        values.is_logged = res.checkToken;
        /* Store the User Data */
        values.user = res.me;
        /* Not loading anymore */
        values.loading = false;
      })
      .catch((err) => {
        /* GraphQL API give error, so it means there is no token */
        values.is_logged = false;
        /* Not loading anymore */
        values.loading = false;
      });
    /* Store all the data on the state */
    setAuthData(values);
  };
  const login = async (EmailUsername: string, password: string) => {
    /* Login mutation, the Backend will check if user inserted Email or Username, so we don't need to check there  */
    await loginFunction({
      variables: {
        data: {
          email: EmailUsername,
          password: password,
        },
      },
    })
      .then((res) => {
        /* There is data */
        if (res.data.login) {
          /* Will set the token on localStorage */
          localStorage.setItem("token", res.data.login);
          /* And on Global State */
          token.set(res.data.login);
          /* Get new Data */
          getUserData();
          /* Set user logged in */
          AuthData.is_logged = true;
          /* Redirect to main page */
          routes.redirect("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const logout = () => {
    /* Remove token from localStorage */
    localStorage.removeItem("token");
    /* Not logged in anymore */
    AuthData.is_logged = false;
    /* Delete user previous data */
    AuthData.user = undefined;
    /* Reload Page and then the page will redirect automatic */
    routes.redirect("/");
  };

  /* Run every time opens any page */
  useEffect(() => {
    /* Get user Data */
    getUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ AuthData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
