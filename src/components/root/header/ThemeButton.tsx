import { IconButton, useColorScheme } from "@mui/material";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import useDebugContext from "../../../hooks/useDebugContext";
import { log } from "../../../utils/log";

const ThemeButton = () => {
  const { debug } = useDebugContext();
  const { mode, setMode } = useColorScheme();

  log(debug, "ThemeButton", "mode", mode, true);

  const handleThemeChange = () => {
    log(debug, "ThemeButton", "Change Theme");
    if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  return (
    <IconButton
      size="large"
      aria-label="theme"
      aria-controls="menu-appbar"
      aria-haspopup="false"
      color="inherit"
      onClick={handleThemeChange}
    >
      {mode === "light" && <DarkModeIcon />}
      {mode === "dark" && <LightModeIcon />}
    </IconButton>
  );
};

export default ThemeButton;
