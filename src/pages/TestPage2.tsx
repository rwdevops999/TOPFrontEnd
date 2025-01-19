import { Box, IconButton, Rating } from "@mui/material";
import { Repository } from "../entities/repository";
import { MdOutlineStarBorder } from "react-icons/md";
import ListAltIcon from "@mui/icons-material/ListAlt";

const TestPage2 = ({ repository }: { repository: Repository }) => {
  const openFilesDialog = () => {};

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "200px",
        border: "1px solid #FF00FF",
      }}
    >
      <Box
        sx={{
          width: "150px",
          height: 36,
        }}
      >
        <Rating
          size="small"
          name="read-only"
          value={
            repository.tutorials ? Math.floor(repository.tutorials / 3) : 0
          }
          readOnly
          emptyIcon={<MdOutlineStarBorder className="emptyStar" />}
          sx={{ marginTop: "10px", marginLeft: "5px" }}
        />
      </Box>
      <Box
        sx={{
          width: "50px",
          height: 36,
        }}
      >
        {repository.tutorials !== undefined && repository.tutorials > 0 && (
          <IconButton
            aria-label="files"
            sx={{
              marginTop: "-3px",
            }}
          >
            <ListAltIcon
              sx={{
                color: "#A0A0A0",
                marginLeft: "-5px",
              }}
              onClick={openFilesDialog}
            />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default TestPage2;
