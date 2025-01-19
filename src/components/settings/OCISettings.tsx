import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import useDebugContext from "../../hooks/useDebugContext";
import { log } from "../../utils/log";
import axios from "axios";
import { useSnackbar } from "notistack";
import SettingField from "./SettingField";

const OCISettings = ({ handleChange }: { handleChange?(data?: any): void }) => {
  const { isAuthenticated } = useAuth0();
  const { debug } = useDebugContext();
  const [settings, setSettings] = useState<any[]>([]);
  const { enqueueSnackbar } = useSnackbar();

  log(debug, "OCISettings", "IN");

  useEffect(() => {
    enqueueSnackbar("Retrieving OCI Settings", {
      variant: "info",
    });
    async function getOCISettings() {
      await axios
        .get("/settings/type/OCI")
        .then((response) => {
          if (response.data) {
            log(
              debug,
              "OCISettings",
              "Found OCI Settings",
              response.data,
              true
            );
            enqueueSnackbar("OCI Settings retrieved", {
              variant: "info",
            });
            setSettings([...response.data]);
            // if (handleChange) {
            //   response.data.map((setting: Setting) => handleChange(setting));
            // }
          }
        })
        .catch(function () {
          log(debug, "OCISettings", "ERROR Finding OCI Settings");
          setSettings([]);
          enqueueSnackbar("Error retrieving OCI Settings", {
            variant: "error",
          });
        });
    }

    log(debug, "OCISettings", "get OCI settings");
    getOCISettings();
  }, []);

  return (
    <>
      {settings.map((setting) => (
        <SettingField
          key={setting.key}
          label={setting.key}
          handleChange={handleChange}
          type="OCI"
          value={setting.value}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </>
  );
};

export default OCISettings;
