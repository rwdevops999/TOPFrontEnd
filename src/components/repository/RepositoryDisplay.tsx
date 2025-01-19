import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import useDebugContext from "../../hooks/useDebugContext";
import { log } from "../../utils/log";
import { Repository } from "../../entities/repository";
import RepositoryContainer from "./RepositoryContainer";

const RepositoryDisplay = ({
  repositories,
}: {
  repositories: Repository[];
}) => {
  const { debug } = useDebugContext();

  log(debug, "RepositoryDisplay", "Setup, Repositories", repositories, true);

  return (
    <Box sx={{ flexGrow: 1, p: 1 }} data-title="REPOSITORY_DISPLAY">
      <Grid
        container
        sx={{
          "--Grid-borderWidth": "1px",
          borderColor: "divider",
          "& > div": {
            borderRight: "var(--Grid-borderWidth) solid",
            borderBottom: "var(--Grid-borderWidth) solid",
            borderColor: "divider",
          },
        }}
      >
        {repositories.map((repository, index) => (
          <Grid key={index} marginLeft={3} marginTop="5px">
            <RepositoryContainer repository={repository} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default RepositoryDisplay;
