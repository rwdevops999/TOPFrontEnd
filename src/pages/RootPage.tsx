import Grid from "@mui/material/Grid2";
import { Item } from "../mui/Item";
import styled from "@emotion/styled";
import {
  createTheme,
  Paper,
  useColorScheme,
  ThemeProvider,
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { log } from "../utils/log";
import { DT_ROOT, PROOT, TITLE } from "../utils/constants";
import { useData, useHeader, useTutopedia } from "../hooks/custom";
import Providers from "../providers/Providers";
import Sidebar from "../components/root/Sidebar";
import Footer from "../components/root/footer/Footer";
import Header from "../components/root/header/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

const debug = true;

const OUTER_PREFIX = "OuterGrid";
const outer_classes = {
  root: `${OUTER_PREFIX}-root`,
  sidebar: `${OUTER_PREFIX}-sidebar`,
  sidebaritem: `${OUTER_PREFIX}-sidebar-item`,
  canvas: `${OUTER_PREFIX}-canvas`,
  canvasitem: `${OUTER_PREFIX}-canvas-item`,
};

const OuterGrid = styled(Grid)(({}) => ({
  [`&.${outer_classes.root}`]: {
    width: "100%",
    height: "98%",
  },
  [`& .${outer_classes.sidebar}`]: {
    width: "calc(15% - 8px)",
    height: "110%",
  },
  [`& .${outer_classes.sidebaritem}`]: {
    height: "calc(100% - 16px)",
  },
  [`& .${outer_classes.canvas}`]: {
    width: "85%",
  },
  [`& .${outer_classes.canvasitem}`]: {
    height: "calc(100% - 15px)",
  },
}));

const INNER_PREFIX = "InnerGrid";
const inner_classes = {
  root: `${INNER_PREFIX}-root`,
  header: `${INNER_PREFIX}-header`,
  content: `${INNER_PREFIX}-content`,
};

const InnerGrid = styled(Grid)(({}) => ({
  [`&.${inner_classes.root}`]: {
    height: "100%",
  },
  [`& .${inner_classes.header}`]: {
    height: "5%",
  },
  [`& .${inner_classes.content}`]: {
    height: "87%",
    marginTop: "5px",
    marginBottom: "5px",
  },
}));

const RootPage = () => {
  let { state } = useLocation();
  const { setMode } = useColorScheme();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  setMode("light");

  log(debug, "RootPage", "IN", state, true);

  const [defaultRepo, setDefaultRepo] = useState<string>("Not Set");

  const { count } = useTutopedia(state);

  useEffect(() => {
    async function getDefaultRepo() {
      await axios
        .get("/repository/default")
        .then((response) => {
          if (response.data) {
            log(
              debug,
              PROOT,
              "Default repository received",
              response.data,
              true
            );
            setDefaultRepo(response.data.name);
            enqueueSnackbar("Default repository found", { variant: "success" });
          }
        })
        .catch((error) => {
          log(
            debug,
            PROOT,
            "Error loading default repository. Not set yet: " + error.message
          );
          enqueueSnackbar("Error loading default repository", {
            variant: "error",
          });
        });
    }

    log(debug, PROOT, "Loading default repository");
    enqueueSnackbar("Loading default repository", { variant: "info" });
    getDefaultRepo();
  }, []);

  const renderRootPage = () => {
    log(debug, PROOT, "RENDER", defaultRepo, true);

    const { title, subtitle } = useHeader(state);

    // return <>{defaultRepo}</>;
    return (
      <ThemeProvider theme={theme}>
        <OuterGrid
          data-title={DT_ROOT}
          container
          spacing={1}
          className={outer_classes.root}
        >
          <Grid size={2} className={outer_classes.sidebar}>
            <Item className={outer_classes.sidebaritem}>
              <Sidebar />
            </Item>
          </Grid>
          <Grid size={9} className={outer_classes.canvas}>
            <Item className={outer_classes.canvasitem}>
              <InnerGrid className={inner_classes.root}>
                <Grid component={Paper} className={inner_classes.header}>
                  <Header title={title} subtitle={subtitle} />
                </Grid>
                <Grid
                  data-title="OUTLET"
                  component={Paper}
                  className={inner_classes.content}
                >
                  <Outlet />
                </Grid>
                <Footer repoName={defaultRepo} />
              </InnerGrid>
            </Item>
          </Grid>
        </OuterGrid>
      </ThemeProvider>
    );
  };

  return <Providers>{renderRootPage()}</Providers>;
};

export default RootPage;
