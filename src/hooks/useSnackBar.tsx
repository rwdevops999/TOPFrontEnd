import { Button } from "@mui/material";
import { OptionsObject, useSnackbar } from "notistack";
import { useCallback } from "react";

const useSnackbarQueue = () => {
  const { enqueueSnackbar: _enqueueSnackbar, closeSnackbar } = useSnackbar();

  const DismissAction = useCallback(
    (key) => (
      <Button style={{ color: "#fff" }} onClick={() => closeSnackbar(key)}>
        Dismiss
      </Button>
    ),
    [closeSnackbar]
  );

  const enqueueSnackbarCallback = useCallback(
    (message: string, options: OptionsObject = {}) =>
      () => {
        if (options.persist) {
          options.action = DismissAction;
        }

        _enqueueSnackbar(message, options);
      },
    [_enqueueSnackbar, DismissAction]
  );

  const enqueueSnackbar = useCallback(
    (message: string, options: OptionsObject = {}) => {
      if (options.persist) {
        options.action = DismissAction;
      }

      _enqueueSnackbar(message, options);
    },
    [_enqueueSnackbar, DismissAction]
  );

  return { enqueueSnackbar, enqueueSnackbarCallback, closeSnackbar };
};
