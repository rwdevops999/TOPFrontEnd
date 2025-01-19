import { Box, IconButton, Rating } from "@mui/material";
import { Repository } from "../../entities/repository";
import { MdOutlineStarBorder } from "react-icons/md";
import ListAltIcon from "@mui/icons-material/ListAlt";
import RepositoryFilesDialog from "./RepositoryFilesDialog";
import { useState } from "react";

const RepositoryInfo = ({ repository }: { repository: Repository }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "20%",
        }}
      >
        <Box
          sx={{
            width: "83%",
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
            width: "17%",
          }}
        >
          {repository.tutorials !== undefined && repository.tutorials > 0 && (
            <IconButton
              aria-label="files"
              sx={{
                marginTop: "-3px",
              }}
              onClick={handleOpen}
            >
              <ListAltIcon
                sx={{
                  color: "#A0A0A0",
                  marginLeft: "-5px",
                }}
              />
            </IconButton>
          )}
        </Box>
      </Box>
      <RepositoryFilesDialog
        id="repository-transfer"
        repositoryName={repository.name!}
        keepMounted
        open={open}
        onClose={handleClose}
      />
    </>
  );
};

export default RepositoryInfo;
