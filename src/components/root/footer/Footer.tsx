import styled from "@emotion/styled";
import Grid from "@mui/material/Grid2";

import { Typography } from "@mui/material";
import { DT_FOOTER } from "../../../utils/constants";
import { Item } from "../../../mui/Item";
import UserName from "./UserName";
import RepositoryName from "./RepositoryName";
import Time from "./Time";
import SessionTime from "./SessionTime";

const PREFIX = "Footer";
const classes = {
  root: `${PREFIX}-root`,
  typo: `${PREFIX}-typo`,
};

const FooterGrid = styled(Grid)(({}) => ({
  [`&.${classes.root}`]: {
    border: "none",
  },
  [`& .${classes.typo}`]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Footer = ({ repoName }: { repoName: string }) => {
  return (
    <FooterGrid
      data-title={DT_FOOTER}
      container
      spacing={1}
      className={classes.root}
    >
      <Grid size={3}>
        <Item sx={{ height: "34px" }}>
          <Typography variant="overline" gutterBottom className={classes.typo}>
            <UserName />
          </Typography>
        </Item>
      </Grid>
      <Grid size={3}>
        <Item sx={{ height: "34px" }}>
          <Typography variant="overline" gutterBottom className={classes.typo}>
            <RepositoryName repoName={repoName} />
          </Typography>
        </Item>
      </Grid>
      <Grid size={3}>
        <Item sx={{ height: "34px" }}>
          <Typography variant="overline" gutterBottom className={classes.typo}>
            <Time />
          </Typography>
        </Item>
      </Grid>
      <Grid size={3}>
        <Item sx={{ height: "34px" }}>
          <Typography variant="overline" gutterBottom className={classes.typo}>
            <SessionTime />
          </Typography>
        </Item>
      </Grid>
    </FooterGrid>
  );
};

export default Footer;
