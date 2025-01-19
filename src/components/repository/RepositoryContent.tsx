import { Box, IconButton, Typography } from "@mui/material";
import { Repository } from "../../entities/repository";
import NumberIcon from "../../icons/NumberIcon";
import CalendarIcon from "../../icons/CalendarIcon";

const RepositoryContent = ({ repository }: { repository: Repository }) => {
  return (
    <Box sx={{ width: "100%", height: "48%" }}>
      <Box>
        <IconButton aria-label="numbers" disabled>
          <NumberIcon />
          <Typography>{repository.tutorials}</Typography>
        </IconButton>
      </Box>
      <Box>
        <IconButton aria-label="numbers">
          <CalendarIcon />
          <Typography>
            {repository.updateDate
              ? new Date(repository.updateDate).toLocaleDateString("en-GB")
              : "--/--/----"}
          </Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

export default RepositoryContent;
