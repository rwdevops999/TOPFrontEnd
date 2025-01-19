import { Tutorial } from "../../entities/tutorial";

import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import styled from "@emotion/styled";
import {
  Badge,
  Box,
  Divider,
  SpeedDial,
  SpeedDialAction,
  Typography,
} from "@mui/material";
import useDebugContext from "../../hooks/useDebugContext";
import { log } from "../../utils/log";
import axios, { AxiosError } from "axios";
import { HeaderBuilder } from "../../builders/HeaderBuilder";
import {
  CREPOSITORYDIALOG,
  CTUTORIALCONTAINER,
  DT_TUTORIALS_CONTAINER,
  DT_TUTORIALS_ITEM,
  ROUTE_CREATE,
  ROUTE_TUTORIALS,
  STTUTORIALS_ALL,
  STTUTORIALS_PUB,
  STUPDATE,
} from "../../utils/constants";
import { useLocation, useNavigate } from "react-router-dom";
import { buildStateForStartup } from "../../builders/builders";
import { DataBuilder } from "../../builders/DataBuilder";
import { useTutopedia } from "../../hooks/custom";
import { enqueueSnackbar } from "notistack";

const PREFIX = "TutorialContainer";
const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  info: `${PREFIX}-info`,
};

const actions = [
  { icon: <EditNoteIcon />, name: "Edit" },
  { icon: <UpgradeIcon />, name: "Publish" },
  { icon: <DeleteForeverIcon />, name: "Delete" },
];

const Container = styled(Box)(({}) => ({
  [`&.${classes.root}`]: {
    width: "99.5%",
    height: "20%",
    marginBottom: "5px",
    display: "flex",
    border: "1px solid",
  },
  [`& .${classes.content}`]: {
    width: "80%",
    height: "100%",
    marginLeft: "10px",
  },
  [`& .${classes.info}`]: {
    width: "20%",
    height: "100%",
    alignItems: "center",
    display: "flex",
  },
}));

const TutorialContainer = ({ tutorial }: { tutorial: Tutorial }) => {
  const { debug } = useDebugContext();
  let { state } = useLocation();
  const navigate = useNavigate();

  log(debug, "TUTORIAL_CONTAINER", "In", tutorial, true);

  const { count } = useTutopedia(state);

  const lpad = (value: number | undefined, padding: number) => {
    if (value === undefined) {
      value = 0;
    }

    var zeroes = new Array(padding + 1).join("0");
    return (zeroes + value).slice(-padding);
  };

  const navigateToTutorials = (
    viewMode: "All" | "Pub" | "Unpub",
    subtitle: string
  ) => {
    let header = new HeaderBuilder("Tut-O-Pedia", subtitle).build();
    let dataBuilder = new DataBuilder();
    dataBuilder.setViewMode(viewMode);
    dataBuilder.setReload(true);
    state = buildStateForStartup({
      count: count + 1,
      routeUrl: ROUTE_TUTORIALS,
      sender: CTUTORIALCONTAINER,
      header: header,
      data: dataBuilder.build(),
    });

    navigate(state.state.tutopedia.routeUrl, state);
  };

  const editTutorial = (tutorialId: number) => {
    let header = new HeaderBuilder("Tut-O-Pedia", STUPDATE).build();
    let dataBuilder = new DataBuilder();
    dataBuilder.setUpdateMode(true);
    dataBuilder.setUpdateId(tutorialId);
    state = buildStateForStartup({
      count: count + 1,
      routeUrl: ROUTE_CREATE,
      sender: CTUTORIALCONTAINER,
      header: header,
      data: dataBuilder.build(),
    });

    navigate(state.state.tutopedia.routeUrl, state);
  };

  const publishTutorial = async (tutorialId: number) => {
    await axios
      .put("/publish/" + tutorialId)
      .then(() => {
        navigateToTutorials("Pub", STTUTORIALS_PUB);
      })
      .catch((error) => {
        log(
          debug,
          CTUTORIALCONTAINER,
          "Error publishing tutorial",
          error,
          true
        );

        if (
          error instanceof AxiosError &&
          error.response &&
          error.response.status === 404
        ) {
          log(
            debug,
            CTUTORIALCONTAINER,
            "Error publishing tutorial",
            error.response.statusText,
            true
          );
          enqueueSnackbar(error.response.statusText, { variant: "error" });
        }
      });
  };

  const deleteTutorial = async (tutorialId: number) => {
    await axios.delete("/delete/" + tutorialId).then(() => {
      navigateToTutorials("All", STTUTORIALS_ALL);
    });
  };

  const handeAction = (action: string, tutorialId: number) => {
    switch (action) {
      case "Edit":
        editTutorial(tutorialId);
        break;
      case "Publish":
        publishTutorial(tutorialId);
        break;
      case "Delete":
        deleteTutorial(tutorialId);
        break;
    }
  };

  return (
    <Container data-title={DT_TUTORIALS_ITEM} className={classes.root}>
      <Box className={classes.content}>
        <Typography
          variant="h6"
          sx={{ color: "text.secondary", fontSize: 18 }}
          component="div"
        >
          [{lpad(tutorial.id, 3)}]: {tutorial.title}
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 5.5 }}>
          {tutorial.description}
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Box color="#00FF00">
            <AttachFileIcon />
          </Box>
          <Box>
            <Typography sx={{ color: "#00FF00", mb: 1.5 }}>
              &nbsp;{tutorial.filename}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider orientation="vertical" />
      <Box className={classes.info}>
        {/* <Badge color="success" badgeContent="published" /> */}
        <Badge
          color={tutorial.published ? "success" : "warning"}
          badgeContent={tutorial.published ? "published" : "unpublished"}
          sx={{ marginLeft: "130px", marginBottom: "100px" }}
        />
        {!tutorial.published && (
          <SpeedDial
            ariaLabel="SpeedDial"
            sx={{ position: "relative", bottom: -30, right: 130 }}
            icon={<SpeedDialIcon />}
            direction="left"
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => handeAction(action.name, tutorial.id!)}
              />
            ))}
          </SpeedDial>
        )}
      </Box>
    </Container>
  );
};

export default TutorialContainer;
