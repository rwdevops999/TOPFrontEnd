import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { Repository } from "../../entities/repository";
import axios from "axios";
import {
  CREPOCHECK,
  PREPOSITORY,
  ROUTE_REPOSITORY,
  TITLE,
} from "../../utils/constants";
import { useTutopedia } from "../../hooks/custom";
import { useLocation, useNavigate } from "react-router-dom";
import useDebugContext from "../../hooks/useDebugContext";
import { TutopediaState } from "../../appdata/appdata";
import { log } from "../../utils/log";
import { HeaderBuilder } from "../../builders/HeaderBuilder";
import { buildStateForStartup } from "../../builders/builders";
import { DataBuilder } from "../../builders/DataBuilder";
import { useSnackbar } from "notistack";

const RepositoryCheck = ({ repository }: { repository: Repository }) => {
  let { state } = useLocation();
  const { count } = useTutopedia(state);
  const { debug } = useDebugContext();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  let tutopedia: TutopediaState = {
    count: count + 1,
    sender: CREPOCHECK,
    routeUrl: ROUTE_REPOSITORY,
  };

  const handleChangeDefault = async (repository: Repository) => {
    enqueueSnackbar("Changing default repository", { variant: "info" });
    await axios.put("/repository/default/" + repository.id).then(() => {
      enqueueSnackbar("Default repository changed", { variant: "info" });
      log(debug, CREPOCHECK, "Updated Default repository");
    });

    const headerBuilder = new HeaderBuilder(TITLE, PREPOSITORY);
    tutopedia.message = "changed default repository";
    tutopedia.header = headerBuilder.build();

    const dataBuilder = new DataBuilder();
    dataBuilder.setReload(true);
    tutopedia.data = dataBuilder.build();

    state = buildStateForStartup(tutopedia);
    navigate(state.state.tutopedia.routeUrl, state);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "15%",
        marginLeft: "-1px",
      }}
    >
      <FormGroup>
        {repository.id && (
          <FormControlLabel
            sx={{
              marginTop: "-5px",
              marginLeft: "0.5px",
              "& > .MuiTypography-root": {
                "&.Mui-disabled": {
                  color: "#1976D2",
                },
              },
            }}
            control={
              <Checkbox
                inputProps={{
                  id: repository.name,
                  placeholder: "BUCKET_CONTAINER_BUCKET_DEFAULT_INPUT",
                  disabled: repository.selected,
                }}
                data-title="BUCKET_CONTAINER_BUCKET_DEFAULT"
                defaultChecked={repository.selected}
                color="secondary"
                onChange={() => handleChangeDefault(repository)}
                sx={{
                  color: "#0D3B69",
                  "&.Mui-checked": {
                    color: "#173A5E",
                  },
                }}
                disabled={repository.selected}
              />
            }
            label="Default"
          />
        )}
      </FormGroup>
    </Box>
  );
};

export default RepositoryCheck;
