import styled from "@emotion/styled";
import { Box, Divider } from "@mui/material";
import { Repository } from "../../entities/repository";
import TestPage2 from "../../pages/TestPage2";
import RepositoryHeader from "./RepositoryHeader";
import RepositoryContent from "./RepositoryContent";
import RepositoryCheck from "./RepositoryCheck";
import RepositoryInfo from "./RepositoryInfo";

const PREFIX = "RepositoryContainer";
const classes = {
  root: `${PREFIX}-root`,
  root2: `${PREFIX}-root2`,
};

const RepoContainer = styled(Box)(({}) => ({
  [`&.${classes.root}`]: {
    width: "200px",
    height: "183px",
    border: "1px solid #000000",
  },
}));

const RepositoryContainer = ({ repository }: { repository: Repository }) => {
  return (
    <div id={repository.name} data-title="REPOSITIRY_CONTAINER">
      <RepoContainer className={classes.root}>
        <RepositoryHeader repository={repository} />
        <Divider component="div" />
        <RepositoryContent repository={repository} />
        <Divider component="div" />
        <RepositoryCheck repository={repository} />
        <Divider component="div" />
        <RepositoryInfo repository={repository} />
      </RepoContainer>
    </div>
  );
};

export default RepositoryContainer;
