import { Auth0Provider } from "@auth0/auth0-react";
import { PropsWithChildren } from "react";

const AuthProvider = ({ children }: PropsWithChildren) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENTID;

  if (!domain || !clientId) {
    throw new Error(
      "Auth0 is not configured. Follow the instruction on README.md."
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;
