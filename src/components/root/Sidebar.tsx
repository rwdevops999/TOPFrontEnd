import AppProvider, { Navigation } from "../../mui/AppProvider";

import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";

import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";

import NoteAddIcon from "@mui/icons-material/NoteAdd";

import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import KeyIcon from "@mui/icons-material/Key";
import PinIcon from "@mui/icons-material/Pin";

import CloudIcon from "@mui/icons-material/Cloud";
import SettingsIcon from "@mui/icons-material/Settings";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import TheatersTwoToneIcon from "@mui/icons-material/TheatersTwoTone";

import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import {
  CSIDEBAR,
  DT_SIDEBAR_CLOUD,
  DT_SIDEBAR_CLOUD_REPOSITORY,
  DT_SIDEBAR_CLOUD_SETTINGS,
  DT_SIDEBAR_CREATE,
  DT_SIDEBAR_FIND,
  DT_SIDEBAR_FIND_KEYWORD,
  DT_SIDEBAR_HOME,
  DT_SIDEBAR_SEARCH_ID,
  DT_SIDEBAR_SOCIAL_MEDIA,
  DT_SIDEBAR_TUTOPEDIA,
  DT_SIDEBAR_TUTORIALS_ALL,
  DT_SIDEBAR_TUTORIALS_PUB,
  DT_SIDEBAR_TUTORIALS_UNPUB,
  MCREATE,
  MFIND_KEYWORD,
  MREPOSITORY,
  MSEARCH_ID,
  MSETTINGS,
  MTUTOPEDIA,
  MTUTORIALS_ALL,
  MTUTORIALS_PUB,
  MTUTORIALS_UNPUB,
  PCREATE,
  PREPOSITORY,
  PROOT,
  PSETTINGS,
  ROUTE_CREATE,
  ROUTE_FIND,
  ROUTE_REPOSITORY,
  ROUTE_ROOT,
  ROUTE_SEARCH,
  ROUTE_SETTINGS,
  ROUTE_TUTORIALS,
  STFIND_BY_KEYWORD,
  STSEARCH_BY_ID,
  STTUTORIALS_ALL,
  STTUTORIALS_PUB,
  STTUTORIALS_UNPUB,
} from "../../utils/constants";
import { useTutopedia } from "../../hooks/custom";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../mui/DashboardLayout";
import { buildStateForStartup } from "../../builders/builders";
import { HeaderState } from "../../appdata/appdata";
import { HeaderBuilder } from "../../builders/HeaderBuilder";
// import { useAuth0 } from "@auth0/auth0-react";
import useDebugContext from "../../hooks/useDebugContext";
import { log } from "../../utils/log";
import { DataBuilder } from "../../builders/DataBuilder";

const NAVIGATION: Navigation = [
  // {
  //   segment: "logout",
  //   title: "Logout",
  //   icon: <LocalLibraryIcon />,
  //   id: "Logout",
  // },
  {
    kind: "header",
    title: "Root",
  },
  {
    segment: "tutopedia",
    title: "Tutopedia",
    icon: <LocalLibraryIcon />,
    id: MTUTOPEDIA,
    datatitle: DT_SIDEBAR_TUTOPEDIA,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Pages",
  },
  {
    segment: "home",
    title: "Home",
    icon: <HomeWorkIcon />,
    datatitle: DT_SIDEBAR_HOME,
    children: [
      {
        segment: "all",
        title: "All Tutorials",
        icon: <AllInclusiveIcon />,
        id: MTUTORIALS_ALL,
        datatitle: DT_SIDEBAR_TUTORIALS_ALL,
      },
      {
        segment: "published",
        title: "Published",
        icon: <PublishedWithChangesIcon />,
        id: MTUTORIALS_PUB,
        datatitle: DT_SIDEBAR_TUTORIALS_PUB,
      },
      {
        segment: "unpublished",
        title: "Unpublished",
        icon: <UnpublishedIcon />,
        id: MTUTORIALS_UNPUB,
        datatitle: DT_SIDEBAR_TUTORIALS_UNPUB,
      },
    ],
  },
  {
    segment: "create",
    title: "Create",
    icon: <NoteAddIcon />,
    id: MCREATE,
    datatitle: DT_SIDEBAR_CREATE,
  },
  {
    segment: "find",
    title: "Find",
    icon: <ContentPasteSearchIcon />,
    datatitle: DT_SIDEBAR_FIND,
    children: [
      {
        segment: "searchid",
        title: "By Id",
        icon: <PinIcon />,
        id: MSEARCH_ID,
        datatitle: DT_SIDEBAR_SEARCH_ID,
      },
      {
        segment: "searchkeyword",
        title: "By Keywords",
        icon: <KeyIcon />,
        id: MFIND_KEYWORD,
        datatitle: DT_SIDEBAR_FIND_KEYWORD,
      },
    ],
  },
  {
    segment: "cloud",
    title: "Cloud",
    icon: <CloudIcon />,
    datatitle: DT_SIDEBAR_CLOUD,
    children: [
      {
        segment: "settings",
        title: "Settings",
        icon: <SettingsIcon />,
        id: MSETTINGS,
        datatitle: DT_SIDEBAR_CLOUD_SETTINGS,
      },
      {
        segment: "repository",
        title: "Repository",
        icon: <CloudUploadIcon />,
        id: MREPOSITORY,
        datatitle: DT_SIDEBAR_CLOUD_REPOSITORY,
      },
    ],
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Social Media",
  },
  {
    segment: "media",
    title: "Media Types",
    icon: <TheatersTwoToneIcon />,
    datatitle: DT_SIDEBAR_SOCIAL_MEDIA,
    children: [
      {
        segment: "facebook",
        title: "Facebook",
        icon: <FacebookIcon />,
        href: "https://www.facebook.com/",
      },
      {
        segment: "mail",
        title: "GMail",
        icon: <EmailIcon />,
        href: "https://mail.google.com/",
      },
      {
        segment: "twitter",
        title: "Twitter",
        icon: <TwitterIcon />,
        href: "https://x.com/",
      },
      {
        segment: "linkedin",
        title: "LinkedIn",
        icon: <LinkedInIcon />,
        href: "https://www.linkedin.com/",
      },
      {
        segment: "instagram",
        title: "Instagram",
        icon: <InstagramIcon />,
        href: "https://www.instagram.com/",
      },
      {
        segment: "whatsapp",
        title: "WhatsApp",
        icon: <WhatsAppIcon />,
        href: "https://web.whatsapp.com/",
      },
    ],
  },
];

const Sidebar = () => {
  let { state } = useLocation();
  const { count } = useTutopedia(state);
  const { debug } = useDebugContext();
  const navigate = useNavigate();
  // const { logout } = useAuth0();

  let header: HeaderState;
  let dataBuilder = new DataBuilder();

  const handleNavigationClick = (id: string) => {
    log(debug, CSIDEBAR, "NavigationClick: " + id);
    log(
      debug,
      CSIDEBAR,
      "NavigationClick: " + id.toLowerCase().includes(MCREATE.toLowerCase())
    );

    switch (id) {
      case MTUTOPEDIA:
        console.log("MTUTOPEDIA CLICKED");
        header = new HeaderBuilder("Tut-O-Pedia", PROOT).build();
        state = buildStateForStartup({
          count: count + 1,
          routeUrl: ROUTE_ROOT,
          sender: CSIDEBAR,
          header: header,
        });

        navigate(state.state.tutopedia.routeUrl, state);
        break;
      case MSETTINGS:
        console.log("MSETTINGS CLICKED");
        header = new HeaderBuilder("Tut-O-Pedia", PSETTINGS).build();
        state = buildStateForStartup({
          count: count + 1,
          routeUrl: ROUTE_SETTINGS,
          sender: CSIDEBAR,
          header: header,
        });

        navigate(state.state.tutopedia.routeUrl, state);
        break;
      case MREPOSITORY:
        console.log("MREPOSITORY CLICKED");
        header = new HeaderBuilder("Tut-O-Pedia", PREPOSITORY).build();
        state = buildStateForStartup({
          count: count + 1,
          routeUrl: ROUTE_REPOSITORY,
          sender: CSIDEBAR,
          header: header,
        });

        navigate(state.state.tutopedia.routeUrl, state);
        break;
      case MCREATE:
        console.log("MCREATE CLICKED");
        header = new HeaderBuilder("Tut-O-Pedia", PCREATE).build();
        state = buildStateForStartup({
          count: count + 1,
          routeUrl: ROUTE_CREATE,
          sender: CSIDEBAR,
          header: header,
        });

        navigate(state.state.tutopedia.routeUrl, state);
        break;
      case MSEARCH_ID:
        console.log("MSEARCH_ID CLICKED");
        header = new HeaderBuilder("Tut-O-Pedia", STSEARCH_BY_ID).build();
        state = buildStateForStartup({
          count: count + 1,
          routeUrl: ROUTE_SEARCH,
          sender: CSIDEBAR,
          header: header,
        });

        navigate(state.state.tutopedia.routeUrl, state);
        break;
      case MFIND_KEYWORD:
        console.log("MFIND_KEYWORD CLICKED");
        header = new HeaderBuilder("Tut-O-Pedia", STFIND_BY_KEYWORD).build();
        state = buildStateForStartup({
          count: count + 1,
          routeUrl: ROUTE_FIND,
          sender: CSIDEBAR,
          header: header,
        });

        navigate(state.state.tutopedia.routeUrl, state);
        break;
      case MTUTORIALS_ALL:
        console.log("MTUTORIALS_ALL CLICKED");
        header = new HeaderBuilder("Tut-O-Pedia", STTUTORIALS_ALL).build();
        dataBuilder.setViewMode("All");
        state = buildStateForStartup({
          count: count + 1,
          routeUrl: ROUTE_TUTORIALS,
          sender: CSIDEBAR,
          header: header,
          data: dataBuilder.build(),
        });

        navigate(state.state.tutopedia.routeUrl, state);
        break;
      case MTUTORIALS_PUB:
        console.log("MTUTORIALS_PUB CLICKED");
        header = new HeaderBuilder("Tut-O-Pedia", STTUTORIALS_PUB).build();
        dataBuilder.setViewMode("Pub");
        state = buildStateForStartup({
          count: count + 1,
          routeUrl: ROUTE_TUTORIALS,
          sender: CSIDEBAR,
          header: header,
          data: dataBuilder.build(),
        });

        navigate(state.state.tutopedia.routeUrl, state);
        break;
      case MTUTORIALS_UNPUB:
        console.log("MTUTORIALS_UNPUB CLICKED");
        header = new HeaderBuilder("Tut-O-Pedia", STTUTORIALS_UNPUB).build();
        dataBuilder.setViewMode("Unpub");
        state = buildStateForStartup({
          count: count + 1,
          routeUrl: ROUTE_TUTORIALS,
          sender: CSIDEBAR,
          header: header,
          data: dataBuilder.build(),
        });

        navigate(state.state.tutopedia.routeUrl, state);
        break;
      //   // case "Logout":
      //   //   console.log("LOGGING OFF");
      //   //   logout();
      //   //   break;
      //   default:
      //     console.log("UNKNOWN CLICKED: " + id);
      //     break;
    }
  };

  return (
    <AppProvider navigation={NAVIGATION}>
      <DashboardLayout handleNavigationClick={handleNavigationClick} />
    </AppProvider>
  );
};

export default Sidebar;
