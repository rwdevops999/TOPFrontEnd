import { useEffect, useState } from "react";
import { Repository } from "../entities/repository";
import axios from "axios";
import { log } from "../utils/log";
import useDebugContext from "../hooks/useDebugContext";
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Pagination } from "@mui/material";
import ErrorBanner from "../Error/ErrorBanner";
import RepositoryDisplay from "../components/repository/RepositoryDisplay";
import styled from "@emotion/styled";
import { useLocation } from "react-router-dom";
import { useData } from "../hooks/custom";
import { DT_REPOSITORY, PREPOSITORY } from "../utils/constants";

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

const PREFIX = "RepoBox";
const classes = {
  root: `${PREFIX}-root`,
  pagination: `${PREFIX}-pagination`,
  data: `${PREFIX}-data`,
};

const RepoBox = styled(Box)(({}) => ({
  [`&.${classes.root}`]: {
    width: "100%",
    height: "100%",
    marginTop: "-10px",
  },
  [`& .${classes.pagination}`]: {
    width: "100%",
    height: "30%",
  },
  [`& .${classes.data}`]: {
    width: "100%",
    height: "70%",
  },
}));

const RepositoryPage = () => {
  let { debug } = useDebugContext();
  const { isAuthenticated } = useAuth0();
  const { state } = useLocation();

  const [repositories, setRepositories] = useState<Repository[]>([{}]);
  const [error, setError] = useState<string | undefined>(undefined);

  const [beginOffset, setBeginOffset] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const repositoriesPerPage = 15;

  const [reposLoaded, setReposLoaded] = useState<boolean>(false);

  const setPage = (loadedRepositories: Repository[]): void => {
    // let page = 0;
    let pages = Math.floor(loadedRepositories.length / repositoriesPerPage) + 1;
    if (currentPage >= pages) {
      setCurrentPage(pages);
    }

    const newOffset =
      ((currentPage - 1) * repositoriesPerPage) % loadedRepositories.length;
    setBeginOffset(newOffset);
  };

  const { errorMessage, reloadData } = useData(state);
  if (errorMessage && Object.keys(errorMessage).length > 0) {
    console.log("SETTING ERROR");
    setError(errorMessage);
    state.tutopedia.data.errorMessage = "";
  }

  useEffect(() => {
    async function loadRepositories() {
      await axios
        .get("/repository/find")
        .then((response) => {
          if (response.data) {
            log(
              debug,
              "RepositoryPage",
              "Found repositories",
              response.data,
              true
            );
            if (isAuthenticated) {
              setRepositories([...response.data, {}]);
              setPage([...response.data, {}]);
            } else {
              setRepositories([...response.data]);
              setPage([...response.data]);
            }

            console.log("SET REPOS LOADED");
            setReposLoaded(true);
          }
        })
        .catch(function (error) {
          if (error.response && error.reponse.status === 404) {
            setRepositories([]);
          } else {
            log(
              debug,
              PREPOSITORY,
              "Error retrieving repositories",
              error.message
            );
            setError(error.message);
          }
        });
    }

    log(debug, "RepositoryPage", "Load Repositories");
    loadRepositories();
  }, [reloadData]);

  let paginatedRepositories: Repository[] = [];
  let pageCount = 0;
  const endOffset = beginOffset + repositoriesPerPage;

  const handlePageChange = (page: number): void => {
    const newOffset = ((page - 1) * repositoriesPerPage) % repositories.length;
    setCurrentPage(page);
    setBeginOffset(newOffset);
  };

  const goBack = () => {
    setError(undefined);
  };

  const renderRepositories = () => {
    console.log("[REPOSITORY PAGE] RENDER??? : " + reposLoaded);
    if (reposLoaded === false) {
      return null;
    }

    console.log("[REPOSITORY PAGE] RENDER");

    if (error) {
      console.log("renderRepositoriesXXX: " + error);
      return (
        <Box data-title="REPOSITORIES_PAGE_ERROR">
          <ErrorBanner message={error} goBack={goBack} />
        </Box>
      );
    }

    if (repositories) {
      paginatedRepositories = Array.from(repositories)
        .sort((a, b) => a.id! - b.id!)
        .slice(beginOffset, endOffset);
      pageCount = Math.ceil(repositories.length / repositoriesPerPage);
      if (!pageCount) {
        pageCount = 0;
      }

      if (
        paginatedRepositories !== undefined &&
        paginatedRepositories.length >= 0
      ) {
        return (
          <RepoBox className={classes.root}>
            <Box className={classes.pagination}>
              <Pagination
                size="small"
                sx={paginationStyle}
                onChange={(_e, value) => handlePageChange(value)}
                count={pageCount}
                defaultPage={currentPage}
                hideNextButton={
                  repositories
                    ? Math.floor(repositories.length / repositoriesPerPage) +
                        1 ===
                      currentPage
                    : true
                }
                hidePrevButton={currentPage <= 1}
              />
            </Box>
            <Box className={classes.data} data-title={DT_REPOSITORY}>
              <RepositoryDisplay repositories={paginatedRepositories} />
            </Box>
          </RepoBox>
        );
      }
    }
  };

  return <header data-title={DT_REPOSITORY}>{renderRepositories()}</header>;
};

export default RepositoryPage;
