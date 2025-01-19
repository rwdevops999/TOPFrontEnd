import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
} from "@mui/material";
import { ReactNode, useEffect, useState } from "react";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useDebugContext from "../../hooks/useDebugContext";
import { log } from "../../utils/log";
import { CSETTINGCATEGORY } from "../../utils/constants";

const SettingCategory = ({
  id,
  expanded = false,
  changeExpand = () => {},
  title = "???",
  icon = <></>,
  component = <></>,
  handleAction = () => {},
  actionTitle = "",
  isActionDisabled = false,
}: {
  id: number;
  expanded?: boolean;
  changeExpand?: (id: number) => void;
  title?: string;
  icon?: ReactNode;
  component?: ReactNode;
  handleAction?(): void;
  actionTitle?: string;
  isActionDisabled?: boolean;
}) => {
  const { debug } = useDebugContext();

  const [expand, setExpand] = useState<boolean>(expanded);

  log(debug, CSETTINGCATEGORY, "IN", isActionDisabled);

  useEffect(() => {
    setExpand(expanded);
  }, [expanded]);

  return (
    <Accordion
      expanded={expand}
      // defaultExpanded={expand}
      onChange={(_e, expanded: boolean) => {
        if (expanded) {
          changeExpand(id);
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${id}-content`}
        id={`panel${id}-header`}
      >
        {icon}&nbsp;
        {title}
      </AccordionSummary>
      <AccordionDetails>{component}</AccordionDetails>
      <AccordionActions>
        <Button disabled={isActionDisabled} onClick={handleAction}>
          {actionTitle}
        </Button>
      </AccordionActions>
    </Accordion>
  );
};

export default SettingCategory;
