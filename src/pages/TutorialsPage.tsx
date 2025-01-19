import { Box, Pagination, SpeedDial, SpeedDialAction } from "@mui/material";
import { log } from "../utils/log";
import {
  DT_SPEEDDIAL,
  DT_TUTORIALS,
  DT_TUTORIALS_CONTAINER,
  PTUTORIALS,
  ROUTE_TUTORIALS,
  STTUTORIALS_ALL,
  STTUTORIALS_PUB,
} from "../utils/constants";
import { useLocation, useNavigate } from "react-router-dom";
import { useData, useTutopedia } from "../hooks/custom";
import { useEffect, useRef, useState } from "react";
import { Tutorial } from "../entities/tutorial";
import { useSnackbar } from "notistack";
import axios, { AxiosError } from "axios";
import TutorialContainer from "../components/tutorial/TutorialContainer";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { HeaderBuilder } from "../builders/HeaderBuilder";
import { DataBuilder } from "../builders/DataBuilder";
import { buildStateForStartup } from "../builders/builders";

const paginationStyle = {
  marginTop: "15px",
  "& .MuiButtonBase-root": {
    color: "#FF0000 !Important",
  },
  "& .Mui-selected": {
    bgcolor: "#B88E2F !Important",
    color: "#FF0000 !Important",
  },
};

const actions = [
  { icon: <PublishedWithChangesIcon />, name: "Publish All" },
  { icon: <ClearAllIcon />, name: "Delete All" },
];

const TutorialsPage = () => {
  let { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  log(true, PTUTORIALS, "In, State", state, true);

  const { count } = useTutopedia(state);

  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [_, setReload] = useState(0);

  const [tutorialsPerPage] = useState<number>(5);
  const [beginOffset, setBeginOffset] = useState<number>(0);

  const currentPage = useRef<number>(1);

  let { viewmode, searchId, keywords, reloadData } = useData(state);

  const getUrl = () => {
    let apiURL = "/find";

    log(true, PTUTORIALS, "ViewMode", viewmode);

    if (viewmode === undefined) {
      viewmode = "All";
    }

    switch (viewmode) {
      case "All":
        break;
      case "Pub":
        apiURL += "/published?published=" + true;
        break;
      case "Unpub":
        apiURL += "/published?published=" + false;
        break;
      case "id":
        apiURL += `/${searchId}`;
        break;
      case "keyword":
        apiURL += "/keywords/" + keywords?.toString();
        break;
      default:
        enqueueSnackbar("Invalid view mode", { variant: "error" });
        break;
    }

    return apiURL;
  };

  useEffect(() => {
    async function loadTutorials() {
      log(true, PTUTORIALS, "Load Tutorials", getUrl());
      await axios
        .get(getUrl())
        .then((response) => {
          if (response.data) {
            log(
              true,
              "TutorialsListPage",
              "Tutorials loaded",
              response.data,
              true
            );

            if (response.data.length > 0) {
              enqueueSnackbar("Tutorials Loaded", { variant: "success" });
              setTutorials(response.data);
              // setPage(response.data);
            } else {
              enqueueSnackbar("No Tutorial Found", { variant: "warning" });
              setTutorials([]);
              // setPage([]);
            }
          } else {
            log(true, PTUTORIALS, "No Tutorials Found");
            enqueueSnackbar("No Tutorials Loaded", { variant: "warning" });
            setTutorials([]);
            // setPage([]);
          }
          setReload((x: any) => x + 1);
        })
        .catch(function (error) {
          if (
            error instanceof AxiosError &&
            error.response &&
            error.response.status === 404
          ) {
            enqueueSnackbar(error.response.data, { variant: "warning" });
            setTutorials([]);
          } else {
            log(true, PTUTORIALS, "Error loading tutorials", error.message);
            enqueueSnackbar("Error loading tutorials", { variant: "error" });
            setTutorials([]);
            // setPage([]);
          }
        });
    }

    enqueueSnackbar("Loading Tutorials", { variant: "info" });
    loadTutorials();
  }, [getUrl(), reloadData]);

  let paginatedTutorials: Tutorial[] = [];
  let pageCount = 0;
  const endOffset = beginOffset + tutorialsPerPage;

  const handlePageChange = (page: number): void => {
    currentPage.current = page;

    const newOffset = ((page - 1) * tutorialsPerPage) % tutorials!.length;
    setBeginOffset(newOffset);
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
      sender: PTUTORIALS,
      header: header,
      data: dataBuilder.build(),
    });

    navigate(state.state.tutopedia.routeUrl, state);
  };

  const deleteAllTutorials = async () => {
    await axios.delete("/delete").then(() => {
      enqueueSnackbar("Deleting all tutorials", { variant: "info" });

      navigateToTutorials("All", STTUTORIALS_ALL);
    });
  };

  const publishAllTutorials = async () => {
    await axios
      .put("/publish")
      .then(() => {
        navigateToTutorials("Pub", STTUTORIALS_PUB);
      })
      .catch(() => {
        log(true, PTUTORIALS, "Error publishing all");
        enqueueSnackbar(
          "Error publishing all tutorials: Is default bucket defined?",
          { variant: "error" }
        );
      });
  };

  const handeAction = (action: string) => {
    switch (action) {
      case "Publish All":
        publishAllTutorials();
        break;
      case "Delete All":
        deleteAllTutorials();
        break;
      default:
        break;
    }
  };

  const renderTutorials = () => {
    if (tutorials) {
      paginatedTutorials = Array.from(tutorials)
        .sort((a, b) => a.id! - b.id!)
        .slice(beginOffset, endOffset);
      pageCount = Math.ceil(tutorials.length / tutorialsPerPage);
      if (!pageCount) {
        pageCount = 0;
      }
    }

    log(true, PTUTORIALS, "RENDER", paginatedTutorials, true);

    if (paginatedTutorials !== undefined && paginatedTutorials.length >= 0) {
      return (
        <>
          <Pagination
            size="small"
            sx={paginationStyle}
            onChange={(_e, value) => handlePageChange(value)}
            count={pageCount}
            defaultPage={currentPage.current}
            hideNextButton={
              tutorials
                ? tutorials.length < tutorialsPerPage
                  ? true
                  : false
                : true
            }
            hidePrevButton={currentPage.current <= 1}
          />
          <Box
            data-title={DT_TUTORIALS_CONTAINER}
            overflow={"hidden"}
            sx={{
              width: "100%",
              height: "100%",
            }}
            marginTop={1}
          >
            {paginatedTutorials.map((tutorial) => (
              <TutorialContainer key={tutorial.id} tutorial={tutorial} />
            ))}
          </Box>
          <SpeedDial
            data-title={DT_SPEEDDIAL}
            ariaLabel="SpeedDial"
            sx={{ position: "relative", bottom: 100, right: 10 }}
            icon={<SpeedDialIcon />}
            direction="left"
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => handeAction(action.name)}
              />
            ))}
          </SpeedDial>
        </>
      );
    }

    return null;
  };

  return (
    <Box data-title={DT_TUTORIALS} sx={{ height: "100%" }}>
      {renderTutorials()}
    </Box>
  );
};

export default TutorialsPage;
