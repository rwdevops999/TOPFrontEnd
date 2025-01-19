import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import AddIcon from "../../icons/AddIcon";
import DeleteIcon from "../../icons/DeleteIcon";
import { Repository } from "../../entities/repository";
import { useLocation, useNavigate } from "react-router-dom";
import useDebugContext from "../../hooks/useDebugContext";
import { log } from "../../utils/log";
import axios, { AxiosError } from "axios";
import { TutopediaState } from "../../appdata/appdata";
import { useTutopedia } from "../../hooks/custom";
import {
  CREPOHEADER,
  PREPOSITORY,
  ROUTE_REPOSITORY,
  TITLE,
} from "../../utils/constants";
import { HeaderBuilder } from "../../builders/HeaderBuilder";
import { DataBuilder } from "../../builders/DataBuilder";
import { buildStateForStartup } from "../../builders/builders";
import { Box, TextField, Typography } from "@mui/material";
import StorageIcon from "../../icons/StorageIcon";
import { useSnackbar } from "notistack";

const RepositoryHeader = ({ repository }: { repository: Repository }) => {
  const [addEnabled, setAddEnabled] = useState<boolean>(false);
  let { state } = useLocation();
  const { debug } = useDebugContext();
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  log(debug, "RepositoryHeader", "IN, STATE", state, true);

  let newrepo: Repository;
  let errorMessage: string;

  const { count } = useTutopedia(state);
  let tutopedia: TutopediaState = {
    count: count + 1,
    sender: CREPOHEADER,
    routeUrl: ROUTE_REPOSITORY,
  };

  const handleCreateRepository = async () => {
    const input: any = document.getElementById(
      `repositoryname${repository.id}`
    );
    if (input) {
      let repo: FormData = new FormData();
      repo.append("name", input.value);
      enqueueSnackbar("Creating repository", {
        variant: "info",
      });
      // SNACK: loading repo
      await axios
        .post("/repository/create", repo)
        .then((response) => {
          enqueueSnackbar("repository created", { variant: "success" });
          log(debug, CREPOHEADER, "Repository created", response.data, true);
          newrepo = response.data;
        })
        .catch((error) => {
          log(debug, CREPOHEADER, "ERROR Creating Repository");
          if (
            error instanceof AxiosError &&
            error.response &&
            error.response.status === 409
          ) {
            errorMessage =
              "Repository with that name already exists ... choose another name";
          } else {
            errorMessage = error.message;
          }
        });

      const headerBuilder = new HeaderBuilder(TITLE, PREPOSITORY);
      tutopedia.message = "created a repository";
      tutopedia.header = headerBuilder.build();
    }

    if (errorMessage) {
      const dataBuilder = new DataBuilder();
      dataBuilder.setError(errorMessage);
      // dataBuilder.setReload(true);
      tutopedia.data = dataBuilder.build();
    } else {
      const dataBuilder = new DataBuilder();
      dataBuilder.setReload(true);
      // dataBuilder.setReload(true);
      tutopedia.data = dataBuilder.build();
    }

    log(debug, CREPOHEADER, "Check State", state, true);

    state = buildStateForStartup(tutopedia);
    navigate(state.state.tutopedia.routeUrl, state);
  };

  const handleDeleteRepository = async (repository: Repository) => {
    if (repository.selected) {
      errorMessage = "Default repository can't be deleted";
    } else {
      // SNACK Deleting repository
      enqueueSnackbar("Deleting repository", { variant: "info" });
      await axios
        .delete("/repository/delete/" + repository.id)
        .then(() => {
          log(debug, CREPOHEADER, "Deleted repository");
          enqueueSnackbar("repository deleted", { variant: "success" });
        })
        .catch((error) => {
          log(debug, CREPOHEADER, "Error deleting repository");
          errorMessage = `Error deleting repository ${error.message}`;
        });

      const headerBuilder = new HeaderBuilder(TITLE, PREPOSITORY);
      tutopedia.header = headerBuilder.build();
      tutopedia.message = "deleted a repository";
    }

    if (errorMessage) {
      const dataBuilder = new DataBuilder();
      dataBuilder.setError(errorMessage);
      tutopedia.data = dataBuilder.build();
    }

    state = buildStateForStartup(tutopedia);
    console.log("RENAVIGATE");
    navigate(state.state.tutopedia.routeUrl, state);
  };

  const keyPress = (event: KeyboardEvent) => {
    event.preventDefault();
    if (event.key === "Enter") {
      handleCreateRepository();
    } else {
      const node: any = document.getElementById(
        `repositoryname${repository.id}`
      );
      const value = node.value;
      if (value.length === 0) {
        setAddEnabled(false);
      } else if (value.length >= 1) {
        setAddEnabled(true);
      }
    }
  };

  useEffect(() => {
    let node = document.getElementById(`repositoryname${repository.id}`)!;

    if (node) {
      node.addEventListener("keyup", keyPress);
    }
  }, []);

  const renderAddButton = () => {
    if (addEnabled) {
      return (
        isAuthenticated === true && <AddIcon onClick={handleCreateRepository} />
      );
    }
    return null;
  };

  const renderDeleteButton = () => {
    return (
      isAuthenticated === true && (
        <DeleteIcon onClick={() => handleDeleteRepository(repository)} />
      )
    );
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          marginTop: "5px",
        }}
      >
        <Box>
          <StorageIcon />
        </Box>
        <Box sx={{ width: "73%" }}>
          {repository.name ? (
            <Typography>{repository.name}</Typography>
          ) : (
            <TextField
              slotProps={{
                htmlInput: {
                  "data-title": "BUCKET_CONTAINER_BUCKET_INPUT",
                  id: `repositoryname${repository.id}`,
                },
              }}
              placeholder="Enter name..."
              sx={{
                input: { color: "gray" },
              }}
              size="small"
              id="outlined-basic"
              variant="standard"
            />
          )}
        </Box>
        {repository.name ? renderDeleteButton() : renderAddButton()}
      </Box>
    </div>
  );
};

export default RepositoryHeader;
