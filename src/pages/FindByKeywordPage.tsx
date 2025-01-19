import { useLocation, useNavigate } from "react-router-dom";
import useDebugContext from "../hooks/useDebugContext";
import { log } from "../utils/log";
import { useTutopedia } from "../hooks/custom";
import { Box, Button, createTheme, Typography } from "@mui/material";
import { useState } from "react";
import { MuiChipsInputChip } from "../mui/chip/mui.types";
import styled from "@emotion/styled";
import { MuiChipsInput } from "../mui/chip/MuiChipsInput";
import {
  DT_FIND_PAGE_FORM,
  PFIND_BY_KEYWORD,
  ROUTE_TUTORIALS,
  STTUTORIALS_ALL,
  STTUTORIALS_KEYWORDS,
} from "../utils/constants";
import { HeaderBuilder } from "../builders/HeaderBuilder";
import { buildStateForStartup } from "../builders/builders";
import { useSnackbar } from "notistack";
import { ThemeProvider } from "@emotion/react";

import KeyIcon from "@mui/icons-material/Key";
import { DataBuilder } from "../builders/DataBuilder";

const theme = createTheme({
  palette: {
    text: {
      primary: "#173A5E",
      secondary: "#3B3BEB",
    },
  },
  components: {
    MuiChip: {
      defaultProps: {
        variant: "filled",
      },
    },
  },
});

const MyChipsInputStyled = styled(MuiChipsInput)`
  & input {
    color: white;
  }
`;

const KeywordChipInput = styled(MyChipsInputStyled)({
  "& .MuiChipsInput-Chip": {
    backgroundColor: "#4877A5",
  },
  "& .MuiInputBase-root": {
    border: "1px dotted #0D3B69",
  },
});

const FindByKeywordPage = () => {
  const { debug } = useDebugContext();
  let { state } = useLocation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  log(debug, "FindPage", "In, State", state, true);

  const { count } = useTutopedia(state);

  const [keywords, setKeywords] = useState<MuiChipsInputChip[]>([]);

  const getAvailableKeywordsCount = (): number => {
    return 5 - keywords.length;
  };

  const handleChange = (newValue: MuiChipsInputChip[]) => {
    if (newValue.length <= 5) {
      setKeywords(newValue);
    }
  };

  const getMessageColor = (): string => {
    if (getAvailableKeywordsCount() <= 1) {
      return "error";
    }

    return "success";
  };

  const getMessage = (): string => {
    let message: string = "(" + getAvailableKeywordsCount();
    if (getAvailableKeywordsCount() == 1) {
      message += " keyword left)";
    } else {
      message += " keywords left)";
    }

    return message;
  };

  const navigateToHome = (): void => {
    log(debug, PFIND_BY_KEYWORD, "Back to home");

    const header = new HeaderBuilder("Tut-O-Pedia", STTUTORIALS_ALL);
    state = buildStateForStartup({
      count: count + 1,
      routeUrl: ROUTE_TUTORIALS,
      sender: PFIND_BY_KEYWORD,
      message: "Find by keywords",
      header: header.build(),
    });

    console.log("RENAVIGATE");

    navigate(ROUTE_TUTORIALS, state);
  };

  const handleFind = () => {
    if (keywords.length > 0) {
      log(debug, PFIND_BY_KEYWORD, "Find it...", keywords, true);

      const header = new HeaderBuilder("Tut-O-Pedia", STTUTORIALS_KEYWORDS);
      const dataBuilder = new DataBuilder();
      dataBuilder.setViewMode("keyword");
      dataBuilder.setKeywords(keywords);
      state = buildStateForStartup({
        count: count + 1,
        routeUrl: ROUTE_TUTORIALS,
        sender: PFIND_BY_KEYWORD,
        message: "Find by keywords",
        header: header.build(),
        data: dataBuilder.build(),
      });

      navigate(ROUTE_TUTORIALS, state);
    } else {
      enqueueSnackbar("Keywords must be defined", { variant: "warning" });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <Box color="#FF0000" sx={{ marginTop: "5px" }}>
          <KeyIcon />
        </Box>
        <Box>
          <Typography variant="h5" color="#FF0000">
            Find by keywords
          </Typography>
        </Box>
      </Box>
      <Typography variant="h6" color={`${getMessageColor()}`}>
        <span>{getMessage()}</span>
      </Typography>
      <form
        data-title={DT_FIND_PAGE_FORM}
        onSubmit={() => {
          handleFind();
        }}
      >
        <Box
          data-title="TUTOPEDIA_CONTENT_FIND_PAGE_FORM"
          overflow={"hidden"}
          sx={{
            width: "100%",
            height: "100%",
          }}
          marginTop={1}
        >
          <Box>
            <KeywordChipInput
              id="keywordInputBtn"
              sx={{ marginTop: "20px", width: "40%" }}
              value={keywords}
              placeholder="Enter keyword and press enter"
              onChange={handleChange}
              size="medium"
              hideClearAll={false}
              helperText="Double click a keyword to edit"
              renderChip={(Component: any, key: any, props: any) => {
                return (
                  <Component
                    {...props}
                    id="keywordInputBtn_chip"
                    key={key}
                    icon={<KeyIcon />}
                    disabled={false}
                  />
                );
              }}
              validate={(chipValue: any) => {
                return {
                  isError: chipValue.length < 2,
                  textError: "the value must be at least 2 characters long",
                };
              }}
              label="keywords"
              variant="standard"
              error={false}
              disabled={false}
            />
          </Box>
          <Box
            sx={{ textAlign: "center" }}
            justifyContent="space-between"
            marginTop={theme.spacing(5)}
          >
            <Button
              id="searchBtn"
              variant="contained"
              onClick={handleFind}
              sx={{ marginRight: "10px" }}
            >
              Search
            </Button>
            <Button
              id="cancelBtn"
              variant="contained"
              onClick={() => {
                navigateToHome();
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </form>
    </ThemeProvider>
  );
};

export default FindByKeywordPage;
