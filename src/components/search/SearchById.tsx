import styled from "@emotion/styled";
import { Box, Button, TextField, Typography } from "@mui/material";
import useDebugContext from "../../hooks/useDebugContext";
import { useEffect, useState } from "react";
import { log } from "../../utils/log";
import {
  DT_SEARCH_PAGE,
  DT_SEARCH_PAGE_INPUT,
  PSEARCH_BY_ID,
  ROUTE_TUTORIALS,
  STTUTORIALS_ALL,
  STTUTORIALS_ID,
} from "../../utils/constants";
import PinIcon from "@mui/icons-material/Pin";
import { HeaderBuilder } from "../../builders/HeaderBuilder";
import { useLocation, useNavigate } from "react-router-dom";
import { buildStateForStartup } from "../../builders/builders";
import { useTutopedia } from "../../hooks/custom";
import { DataBuilder } from "../../builders/DataBuilder";

const PREFIX = "Search";
const classes = {
  root: `${PREFIX}-root`,
};

const SearchContainer = styled(Box)(({}) => ({
  [`&.${classes.root}`]: {
    width: "100%",
    height: "6%",
    display: "flex",
  },
}));

const SearchInput = styled(Box)(({}) => ({
  [`&.${classes.root}`]: {
    alignContent: "center",
    justifyContent: "center",
    width: "100%",
    height: "8%",
    display: "flex",
  },
}));

const SearchActions = styled(Box)(({}) => ({
  [`&.${classes.root}`]: {
    alignContent: "center",
    justifyContent: "center",
    width: "100%",
    height: "8%",
    display: "flex",
  },
}));

const SearchById = () => {
  const { debug } = useDebugContext();
  let { state } = useLocation();
  const navigate = useNavigate();

  const { count } = useTutopedia(state);

  const [searchId, setSearchId] = useState<string>("");

  const findTutorialById = (tutorialId: number) => {
    const header = new HeaderBuilder("Tut-O-Pedia", STTUTORIALS_ID);
    const dataBuilder = new DataBuilder();
    dataBuilder.setViewMode("id");
    dataBuilder.setSearchId(tutorialId);

    state = buildStateForStartup({
      count: count + 1,
      routeUrl: ROUTE_TUTORIALS,
      sender: PSEARCH_BY_ID,
      message: "Return from search by id",
      header: header.build(),
      data: dataBuilder.build(),
    });

    navigate(ROUTE_TUTORIALS, state);
  };

  useEffect(() => {
    const node = document.getElementById("inputId");
    node!.addEventListener("keyup", (event: any) => {
      if (event.key === "Enter") {
        findTutorialById(parseInt(event.target.value.trim()));
      }
    });
    // eslint-disable-next-line
  }, []);

  const handleSearch = () => {
    const node = document.getElementById("inputId");
    if (node) {
      log(
        debug,
        PSEARCH_BY_ID,
        `Search tutorial ${(node as HTMLInputElement).value}`
      );

      findTutorialById(parseInt((node as HTMLInputElement).value.trim()));
    }
  };

  const navigateToHome = () => {
    log(debug, PSEARCH_BY_ID, `Back to home`);
    const header = new HeaderBuilder("Tut-O-Pedia", STTUTORIALS_ALL);
    state = buildStateForStartup({
      count: count + 1,
      routeUrl: ROUTE_TUTORIALS,
      sender: PSEARCH_BY_ID,
      message: "Return from search by id",
      header: header.build(),
    });

    navigate(ROUTE_TUTORIALS, state);
  };

  return (
    <>
      <SearchContainer data-title={DT_SEARCH_PAGE} className={classes.root}>
        <Box sx={{ marginTop: "5px", color: "#FF0000" }}>
          <PinIcon />
        </Box>
        <Box>
          <Typography variant="h5" color="#FF0000">
            Search tutorial by ID
          </Typography>
        </Box>
      </SearchContainer>
      <SearchInput className={classes.root}>
        <TextField
          variant="outlined"
          label="Tutorial ID"
          slotProps={{
            htmlInput: {
              "data-title": DT_SEARCH_PAGE_INPUT,
              id: "inputId",
              name: "inputId",
            },
          }}
          defaultValue={searchId ? searchId : ""}
          type="number"
          size="medium"
        ></TextField>
      </SearchInput>
      <SearchActions className={classes.root}>
        <Button onClick={handleSearch}>Search</Button>
        <Button onClick={navigateToHome}>Cancel</Button>
      </SearchActions>
    </>
  );
};

export default SearchById;
