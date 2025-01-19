import { useAuth0 } from "@auth0/auth0-react";
import { Button, IconButton } from "@mui/material";

import AccountCircle from "@mui/icons-material/AccountCircle";

const AuthButton = () => {
  const { isAuthenticated, loginWithPopup, logout } = useAuth0();

  const checkLoggedIn = () => {
    console.log("Login Check: " + isAuthenticated);
  };

  if (isAuthenticated) {
    return (
      <>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Button
          color="inherit"
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Logout
        </Button>
      </>
    );
  }

  return (
    <Button
      color="inherit"
      onClick={() => {
        loginWithPopup();
        () => checkLoggedIn();
      }}
    >
      Login
    </Button>
  );
};

export default AuthButton;
