import { Box } from "@mui/material";
import { DT_STARTUP } from "../utils/constants";

const getRandomInt = (max: number) => {
  return Math.trunc(Math.random() * max) + 1;
};

const StartupPage = () => {
  const getImageSrc = () => {
    return "/src/assets/tutopedia" + getRandomInt(7) + ".jpeg";
  };

  return (
    <Box data-title={DT_STARTUP} sx={{ height: "100%", marginLeft: "20%" }}>
      <img src={getImageSrc()} width="750" height="665" />
    </Box>
  );
};

export default StartupPage;
