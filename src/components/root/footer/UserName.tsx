import { useAuth0 } from "@auth0/auth0-react";
import PersonIcon from "@mui/icons-material/Person";
const UserName = () => {
  const { user } = useAuth0();

  return (
    <>
      <PersonIcon />
      &nbsp;{user ? user.name : "not logged in"}
    </>
  );
};

export default UserName;
