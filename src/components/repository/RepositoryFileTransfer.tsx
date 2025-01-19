import {
  Button,
  Card,
  CardHeader,
  Checkbox,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  styled,
} from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid2";

import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SwipeLeftIcon from "@mui/icons-material/SwipeLeft";
import SwipeRightIcon from "@mui/icons-material/SwipeRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Tutorial } from "../../entities/tutorial";

function valueNotInDestination(value: number, arr: Tutorial[]) {
  return arr.filter((tutorial) => tutorial.id !== value);
}

function valueInDestination(value: number, arr: Tutorial[]) {
  return arr.filter((tutorial) => tutorial.id === value);
}

function not(source: Tutorial[], destination: Tutorial[]) {
  let result: Tutorial[] = source;

  destination.map((value) => {
    result = [...valueNotInDestination(value.id!, result)];
  });

  return result;
}

function union(source: Tutorial[], destination: Tutorial[]) {
  return [...source, ...not(destination, source)];
}

function intersection(source: Tutorial[], destination: Tutorial[]) {
  let result: Tutorial[] = [];

  if (destination && destination.length > 0) {
    destination.map((value) => {
      result = [...result, ...valueInDestination(value.id!, source)];
    });
  } else {
    result = source;
  }

  return result;
}

const RepositoryFileTransfer = ({
  tutorials,
  setUnpublish,
}: {
  tutorials: Tutorial[];
  setUnpublish(tutorials: Tutorial[]): void;
}) => {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  const PREFIX = "RepositoryTransfer";
  const classes = {
    root: `${PREFIX}-root`,
    button: `${PREFIX}-button`,
    cardheader: `${PREFIX}-cardheader`,
    collapse: `${PREFIX}-collapse`,
    list: `${PREFIX}-list`,
  };

  const RepositoryTransfer = styled("div")(({ theme }) => ({
    [`&.${classes.root}`]: {},
    [`& .${classes.button}`]: {
      margin: theme.spacing(0.5, 0),
    },
    [`& .${classes.cardheader}`]: {
      flex: 1,
      padding: theme.spacing(1, 2),
      boxShadow: "0px 4px 80px grey",
    },
    [`& .${classes.collapse}`]: {
      "& .MuiCollapse-wrapperInner": {
        display: "flex",
        flexDirection: "column",
      },
    },
    [`& .${classes.list}`]: {
      height: 230,
      maxHeight: 230,
      // backgroundColor: theme.palette.background.paper,
      overflow: "auto",
      marginTop: 1,
    },
  }));

  const [checked, setChecked] = useState<Tutorial[]>([]);
  const [left, setLeft] = useState<Tutorial[]>(tutorials);
  const [right, setRight] = useState<Tutorial[]>([]);
  const autoFocusId = useRef<number>(
    tutorials.length > 0 ? tutorials[0].id! : -1
  );

  useEffect(() => {
    if (right.length > 0) {
      setUnpublish(right);
    }
  }, [right, setRight]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const numberOfChecked = (items: Tutorial[]) => {
    return intersection(checked, items).length;
  };

  const sortTutorials = (tutorials: Tutorial[], side: string) => {
    const copyItems = [...tutorials].sort((a, b) =>
      a.filename! > b.filename! ? 1 : -1
    );
    if (side === "right") {
      setRight(copyItems);
    } else {
      setLeft(copyItems);
    }
  };

  const moveCheckedToRight = () => {
    sortTutorials(right.concat(leftChecked), "right");
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const moveCheckedToLeft = () => {
    sortTutorials(left.concat(rightChecked), "left");
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const swapItems = () => {
    setRight(left);
    setLeft(right);
  };

  const indexOfChecked = (tutorial: Tutorial): number => {
    let result: number = -1;
    checked.forEach((t: Tutorial, index: number) => {
      if (t.id === tutorial.id) {
        result = index;
      }
    });

    return result;
  };

  const handleToggle = (tutorial: Tutorial) => () => {
    const currentIndex = indexOfChecked(tutorial);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(tutorial);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);

    autoFocusId.current = tutorial.id!;
  };

  const handleToggleAll = (items: Tutorial[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }

    const id: number = items[0].id!;

    autoFocusId.current = id;
  };

  const isFocused = (tutorial: Tutorial): boolean => {
    return tutorial.id! === autoFocusId.current;
  };

  const renderTutorials = (tutorials: Tutorial[]) => {
    if (tutorials) {
      return tutorials.map((tutorial: Tutorial) => {
        const id = `${tutorial.id}-label`;
        return (
          <ListItemButton
            key={tutorial.id}
            role="listItem"
            onClick={handleToggle(tutorial)}
            autoFocus={isFocused(tutorial)}
          >
            <ListItemIcon>
              <Checkbox checked={indexOfChecked(tutorial) !== -1} />
            </ListItemIcon>
            <ListItemText
              id={id}
              primary={`${tutorial.filename} [${tutorial.id}]`}
            />
          </ListItemButton>
        );
      });
    }

    return <></>;
  };

  const renderTutorialsList = (title: ReactNode, tutorials: Tutorial[]) => {
    const [expanded, setExpanded] = useState(true);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    return (
      <Card
        style={{ display: "flex", flexDirection: "column" }}
        // component={Paper}
      >
        <CardHeader
          className={classes.cardheader}
          avatar={
            <Checkbox
              onClick={handleToggleAll(tutorials)}
              checked={
                numberOfChecked(tutorials) === tutorials.length &&
                tutorials.length !== 0
              }
              indeterminate={
                numberOfChecked(tutorials) !== tutorials.length &&
                numberOfChecked(tutorials) !== 0
              }
              disabled={tutorials.length === 0}
              inputProps={{ "aria-label": "all items selected" }}
            />
          }
          title={title}
          subheader={`${numberOfChecked(tutorials)}/${
            tutorials.length
          } selected`}
          action={
            <IconButton
              aria-expanded={expanded}
              aria-label="show more"
              onClick={handleExpandClick}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          }
        />
        <Collapse in={expanded} className={classes.collapse}>
          <List className={classes.list} dense component="div" role="list">
            {renderTutorials(tutorials)}
          </List>
        </Collapse>
      </Card>
    );
  };

  return (
    <RepositoryTransfer className="{classes.root}">
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ width: "700px" }}
      >
        <Item>
          <Paper elevation={3}>{renderTutorialsList("Bucket", left)}</Paper>
        </Item>

        <Item>
          <Grid container direction="column" alignItems="center">
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={moveCheckedToRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              <SwipeRightIcon></SwipeRightIcon>
            </Button>

            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={moveCheckedToLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              <SwipeLeftIcon></SwipeLeftIcon>
            </Button>
            <Button
              variant="outlined"
              size="small"
              className={classes.button}
              onClick={swapItems}
            >
              <SwapHorizIcon></SwapHorizIcon>
            </Button>
          </Grid>
        </Item>

        <Item>
          <Paper elevation={3}>{renderTutorialsList("Tutorials", right)}</Paper>
        </Item>
      </Grid>
    </RepositoryTransfer>
  );
};

export default RepositoryFileTransfer;
