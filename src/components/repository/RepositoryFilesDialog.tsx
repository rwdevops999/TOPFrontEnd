import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  PaperProps,
  Slide,
  styled,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import {
  forwardRef,
  ReactElement,
  Ref,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { Tutorial } from "../../entities/tutorial";
import { log } from "../../utils/log";
import useDebugContext from "../../hooks/useDebugContext";
import {
  CREPOCHECK,
  CREPOSITORYDIALOG,
  PREPOSITORY,
  ROUTE_REPOSITORY,
  TITLE,
} from "../../utils/constants";
import RepositoryFileTransfer from "./RepositoryFileTransfer";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { useLocation, useNavigate } from "react-router-dom";
import { useTutopedia } from "../../hooks/custom";
import { TutopediaState } from "../../appdata/appdata";
import { HeaderBuilder } from "../../builders/HeaderBuilder";
import { DataBuilder } from "../../builders/DataBuilder";
import { buildStateForStartup } from "../../builders/builders";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface RepositoryDialogRawProps {
  id: string;
  keepMounted: boolean;
  open: boolean;
  onClose: (value?: string) => void;
  repositoryName: string;
}

const RepositoryFilesDialog = (props: RepositoryDialogRawProps) => {
  const { debug } = useDebugContext();
  const { enqueueSnackbar } = useSnackbar();
  let { state } = useLocation();
  const navigate = useNavigate();

  const { count } = useTutopedia(state);

  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const unpublish = useRef<Tutorial[]>([]);

  const setUnpublish = (tutorials: Tutorial[]) => {
    unpublish.current = tutorials;
  };

  const { onClose, open, repositoryName, ...other } = props;

  log(
    debug,
    CREPOSITORYDIALOG,
    `IN, repository =  ${props.repositoryName}, OPEN = ${open}`
  );

  useEffect(() => {
    async function getRepositoryTutorials() {
      await axios
        .get(`/repository/${repositoryName}`)
        .then((response) => {
          if (response.data) {
            log(
              debug,
              CREPOSITORYDIALOG,
              "Tutorials loaded",
              response.data,
              true
            );
            log(
              debug,
              CREPOSITORYDIALOG,
              "LOADED FOR TRANSFER: " + response.data,
              true
            );
            setTutorials(response.data);
          }
        })
        .catch(function (error) {
          log(
            debug,
            CREPOSITORYDIALOG,
            "Error loading tutorials",
            error.message
          );
        });
    }

    if (props.repositoryName) {
      getRepositoryTutorials();
    }
  }, []);

  const handleCancel = () => {
    onClose();
  };

  let tutopedia: TutopediaState = {
    count: count + 1,
    sender: CREPOSITORYDIALOG,
    routeUrl: ROUTE_REPOSITORY,
  };

  const unpublishTutorials = async (tutorials: Tutorial[]) => {
    log(debug, CREPOSITORYDIALOG, "Unpublishing Tutorials");

    await axios
      .put("/unpublish", tutorials)
      .then(() => {
        enqueueSnackbar("Tutorials Unpublished", { variant: "success" });

        const headerBuilder = new HeaderBuilder(TITLE, PREPOSITORY);
        tutopedia.message = "unpublished tutorials";
        tutopedia.header = headerBuilder.build();

        const dataBuilder = new DataBuilder();
        dataBuilder.setReload(true);
        tutopedia.data = dataBuilder.build();

        state = buildStateForStartup(tutopedia);
        navigate(state.state.tutopedia.routeUrl, state);
      })
      .catch(() => {
        enqueueSnackbar("Error unpublishing tutorials", { variant: "error" });
      });
  };

  const handleOk = () => {
    log(debug, CREPOSITORYDIALOG, "OK: Unpublish", unpublish, true);

    onClose();

    if (unpublish.current.length > 0) {
      enqueueSnackbar("Unpublish tutorials", { variant: "info" });
      unpublishTutorials(unpublish.current);
    }
  };

  const PREFIX = "Dialog";
  const classes = {
    root: `${PREFIX}-root`,
    button: `${PREFIX}-button`,
    dialog: `${PREFIX}-dialog`,
    content: `${PREFIX}-dialog-content`,
    actions: `${PREFIX}-dialog-actions`,
  };

  const RootDialog = styled(Dialog)(({}) => ({
    [`&.${classes.root}`]: {},
    [`& .${classes.content}`]: {},
    [`& .${classes.actions}`]: {
      justifyContent: "center",
    },
  }));

  function PaperComponent(props: PaperProps) {
    return <Paper {...props} />;
  }

  if (open) {
    return (
      <RootDialog
        fullWidth={false}
        maxWidth="md"
        open={open}
        PaperComponent={PaperComponent}
        aria-labelledby="repository-transfer-dialog"
        {...other}
      >
        <DialogTitle className={classes.content}>
          {"Unpublish tutorials?"}
        </DialogTitle>

        <DialogContent className={classes.content}>
          <RepositoryFileTransfer
            tutorials={tutorials}
            setUnpublish={setUnpublish}
          />
        </DialogContent>

        <DialogActions className={classes.actions}>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleOk}>Ok</Button>
        </DialogActions>
      </RootDialog>
    );
  }

  return <></>;
};

export default RepositoryFilesDialog;
