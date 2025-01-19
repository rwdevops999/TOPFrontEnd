import { useAuth0 } from "@auth0/auth0-react";
import OCISettings from "../components/settings/OCISettings";
import SettingCategory from "../components/settings/SettingCategory";
import CloudIcon from "../icons/CloudIcon";
import { Box, Typography } from "@mui/material";
import SettingsIcon from "../icons/SettingsIcon";
import { useEffect, useState } from "react";
import { DT_SETTINGS, PSETTINGS } from "../utils/constants";
import useDebugContext from "../hooks/useDebugContext";
import { log } from "../utils/log";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Setting } from "../entities/setting";

const SettingsPage = () => {
  const { debug } = useDebugContext();
  const { isAuthenticated } = useAuth0();
  const [expandedId, setExpandedId] = useState<number>(1);
  const { enqueueSnackbar } = useSnackbar();

  const [settings, setSettings] = useState<Setting[]>([]);
  const [_, setReload] = useState<number>(0);

  const getSettingId = (newsetting: Setting): number => {
    const result = settings
      .map((setting, index) => ({ setting: setting, index: index }))
      .filter(({ setting }) => setting.key === newsetting.key);

    if (result.length > 0) {
      if (result[0].index !== -1) {
        console.log("INDEX = " + result[0].index);
        return result[0].index;
      }
    }

    return -1;
  };
  const addSetting = (setting: Setting) => {
    const index = getSettingId(setting);
    if (index !== -1) {
      settings.splice(index, 1);
      settings.push(setting);
    } else {
      settings.push(setting);
    }

    log(debug, PSETTINGS, "added setting", setting, true);

    setSettings(settings);
    setReload((x: any) => x + 1);
  };

  useEffect(() => {
    setExpandedId(1);
  }, []);

  const handleSettingChange = (data: any): void => {
    addSetting(data);
  };

  const saveSetting = async (setting: Setting) => {
    await axios.put("/settings/", setting).then(() => {});
  };

  const handleUpdateAction = () => {
    enqueueSnackbar("Updating Settings", { variant: "info" });
    log(debug, PSETTINGS, "Before Update", settings, true);
    settings.forEach((setting) => {
      console.log("store " + JSON.stringify(setting));
      saveSetting(setting);
    });
    enqueueSnackbar("Settings Updated", { variant: "success" });
  };

  const changeExpand = (id: number) => {
    setExpandedId(id);
  };

  return (
    <header data-title={DT_SETTINGS}>
      <Box sx={{ display: "flex" }}>
        <Box color="#FF0000" sx={{ marginTop: "5px" }}>
          <SettingsIcon />
        </Box>
        <Box>
          <Typography variant="h5" color="#FF0000">
            Settings Page
          </Typography>
        </Box>
      </Box>
      <SettingCategory
        id={1} // category id
        expanded={expandedId === 1} // defines if category is expanded
        changeExpand={changeExpand} // change expand id
        title="Oracle Cloud Infrastructure" // title of the category
        icon={<CloudIcon />} // icon to be displayed before the title
        component={<OCISettings handleChange={handleSettingChange} />} // the content of the category
        handleAction={handleUpdateAction} // action to be executed when action button is clicked
        actionTitle="Update" // title of the action button
        isActionDisabled={settings.length === 0 || !isAuthenticated} // whether the action button is disabled
      />
      <SettingCategory
        id={2}
        expanded={expandedId === 2}
        changeExpand={changeExpand} // change expand id
        title="System"
        component={<></>}
      />
    </header>
  );
};

export default SettingsPage;
