import { AppBar, Toolbar, Typography, useColorScheme } from "@mui/material";
import styled from "@emotion/styled";
import AuthButton from "../header/AuthButton";
import ThemeButton from "../header/ThemeButton";
import useDebugContext from "../../../hooks/useDebugContext";
import { log } from "../../../utils/log";
import { CHEADER, DT_HEADER } from "../../../utils/constants";
import HeaderMenu from "./HeaderMenu";

const Header = ({ title, subtitle }: { title?: string; subtitle?: string }) => {
  const { debug, setDebug } = useDebugContext();
  const { mode } = useColorScheme();

  const isLight: boolean = mode === "light";

  if (!debug) {
    setDebug(true);
  }

  log(debug, CHEADER, "debug", debug);

  const APPBAR_PREFIX = "Appbar";

  const appbar_classes = {
    root: `${APPBAR_PREFIX}-root`,
  };

  const TOPAppBar = styled(AppBar)(({}) => ({
    [`&.${appbar_classes.root}`]: {
      width: "100%",
      height: "100%",
    },
  }));

  return (
    <TOPAppBar
      data-title={DT_HEADER}
      position="static"
      className={appbar_classes.root}
    >
      <Toolbar sx={{ marginTop: "-1%" }}>
        <HeaderMenu />
        {debug && (
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        )}
        {!debug && (
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        )}
        {debug && (
          <>
            {isLight && (
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, color: "#0966C2" }}
              >
                &nbsp;/{subtitle}
              </Typography>
            )}
            {!isLight && (
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, color: "#0A0A0A" }}
              >
                &nbsp;/{subtitle}
              </Typography>
            )}
          </>
        )}
        <AuthButton />
        <ThemeButton />
      </Toolbar>
    </TOPAppBar>
  );
};

export default Header;
