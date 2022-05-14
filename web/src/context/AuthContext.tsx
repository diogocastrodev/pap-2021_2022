import { gql } from "@apollo/client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../graphql/graphql";
import { gqlClient } from "../libs/graphql-request";
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
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

/* GetUser query */
const getUserQuery = gql`
  query user {
    me {
      public_user_id
      email
    }
  }
`;

const checkSessionQuery = gql`
  query checkSession {
    checkToken
  }
`;

const logoutMutation = gql`
  mutation logout {
    logout
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
  /* Access token */
  const token = accessGlobalState();

  const checkSession = async () => {
    await gqlClient
      .request(checkSessionQuery)
      .then((res) => {
        if (res.checkToken) {
          setAuthData({
            user: AuthData.user,
            is_logged: true,
          });
        } else {
          setAuthData({
            user: undefined,
            is_logged: false,
          });
        }
      })
      .catch((err) => {
        setAuthData({
          user: undefined,
          is_logged: false,
        });
      });
  };

  const getUserData = async () => {
    /* Call GraphQL API */
    await gqlClient
      .request(getUserQuery)
      .then((res) => {
        setAuthData({
          is_logged: true,
          user: res.me,
        });
      })
      .catch((err) => {
        // Not logged
      });
  };

  const login = async (EmailUsername: string, password: string) => {
    /* Login mutation, the Backend will check if user inserted Email or Username, so we don't need to check there  */
    await gqlClient
      .request(loginMutation, {
        email: EmailUsername,
        password: password,
      })
      .then((res) => {
        /* There is data */
        if (res.login) {
          setAuthData({
            ...AuthData,
            is_logged: true,
          });
          /* Get new Data */
          getUserData();
          /* Set user logged in */
          /* Redirect to main page */
          routes.redirect("/");
        }
      })
      .catch((err) => {
        throw new Error(err as string);
      });
  };
  const logout = async () => {
    // Destroy the session
    await gqlClient
      .request(logoutMutation)
      .then((res) => {
        if (res.logout) {
          setAuthData({
            is_logged: false,
            user: undefined,
            loading: false,
          });
          /* Reload Page and then the page will redirect automatic */
          routes.redirect("/");
        }
      })
      .catch((err) => {
        throw new Error(err as string);
      });
  };

  /* Run every time opens any page */
  useEffect(() => {
    checkSession();
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
