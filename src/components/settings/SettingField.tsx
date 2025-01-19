import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { useEffect } from "react";

const SettingField = ({
  label = "",
  handleChange,
  type = "",
  value = "",
  isAuthenticated = false,
}: {
  label: string;
  handleChange?(data?: any): void;
  type: string;
  value?: string;
  isAuthenticated?: boolean;
}) => {
  const linkSetting = (label: string) => {
    const node = document.getElementById(label);
    node!.addEventListener("keyup", (event: any) => {
      if (handleChange) {
        handleChange({ key: label, value: event.target.value, type: type });
      }
    });
  };

  useEffect(() => {
    linkSetting(label);
  }, [label]);

  return (
    <>
      <Stack direction="row" spacing={2}>
        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor={`${label}`}>{label}</InputLabel>
          <OutlinedInput
            id={`${label}`}
            startAdornment={<InputAdornment position="start"></InputAdornment>}
            label={`${label}`}
            defaultValue={value}
            disabled={!isAuthenticated}
          />
        </FormControl>
      </Stack>
      &nbsp;
    </>
  );
};

export default SettingField;
