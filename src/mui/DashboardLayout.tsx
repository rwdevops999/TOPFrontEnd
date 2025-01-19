import { Box, Drawer, SxProps } from "@mui/material";
import { Fragment, useCallback, useContext, useRef } from "react";
import { NavigationContext } from "./shared/context";
import DashboardSidebarSubNavigation from "./DashboardSidebarSubNavigation";

export interface DashboardLayoutProps {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps;

  handleNavigationClick: (id: string) => void;
}

const DashboardLayout = (props: DashboardLayoutProps) => {
  const { sx, handleNavigationClick } = props;

  const navigation = useContext(NavigationContext);

  const layoutRef = useRef<Element | null>(null);

  const getDrawerSharedSx = useCallback(() => {
    const drawerWidth = "100%";

    return {
      displayPrint: "none",
      width: drawerWidth,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: {
        position: "absolute",
        width: drawerWidth,
        boxSizing: "border-box",
        backgroundImage: "none",
      },
    };
  }, [true, 320]);

  const selectedItemIdRef = useRef("");

  const handleNavigationLinkClick = useCallback((n: number, e: any) => {
    console.log("CLICKIE: " + n + ": " + e);

    handleNavigationClick(e);

    selectedItemIdRef.current = "";
  }, []);

  const getDrawerContent = () => {
    const isMini: boolean = false;

    return (
      <Fragment>
        <Box
          component="nav"
          aria-label="Desktop"
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "auto",
            pt: navigation[0]?.kind === "header" && !isMini ? 0 : 2,
          }}
        >
          <DashboardSidebarSubNavigation
            subNavigation={navigation}
            depth={0}
            basePath={""}
            onLinkClick={handleNavigationLinkClick}
            selectedItemId={selectedItemIdRef.current}
          />
        </Box>
      </Fragment>
    );
  };

  return (
    <Box
      ref={layoutRef}
      sx={{
        position: "relative",
        display: "flex",
        overflow: "hidden",
        height: "100%",
        width: "100%",
        ...sx,
      }}
    >
      <Fragment>
        <Drawer
          variant="permanent"
          sx={{
            height: "100%",
            display: { xs: "none", md: "block" },
            ...getDrawerSharedSx(),
            backgroundColor: "#FF0000",
          }}
        >
          {getDrawerContent()}
        </Drawer>
      </Fragment>
    </Box>
  );
};

export default DashboardLayout;
