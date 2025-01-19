import { RouteObject } from "react-router-dom";
import RootPage from "../pages/RootPage";
import {
  ROUTE_CREATE,
  ROUTE_FIND,
  ROUTE_REPOSITORY,
  ROUTE_ROOT,
  ROUTE_SEARCH,
  ROUTE_SETTINGS,
  ROUTE_TEST,
  ROUTE_TUTORIALS,
} from "../utils/constants";
import StartupPage from "../pages/StartupPage";
import SettingsPage from "../pages/SettingsPage";
import RepositoryPage from "../pages/RepositoryPage";
import CreatePage from "../pages/CreatePage";
import TutorialsPage from "../pages/TutorialsPage";
import SearchByIdPage from "../pages/SearchByIdPage";
import FindByKeywordPage from "../pages/FindByKeywordPage";
import TestPage from "../pages/TestPage";

export const routes: RouteObject[] = [
  {
    path: ROUTE_ROOT,
    element: <RootPage />,
    children: [
      { index: true, element: <StartupPage /> },
      { path: ROUTE_SETTINGS, element: <SettingsPage /> },
      { path: ROUTE_REPOSITORY, element: <RepositoryPage /> },
      { path: ROUTE_CREATE, element: <CreatePage /> },
      { path: ROUTE_TUTORIALS, element: <TutorialsPage /> },
      { path: ROUTE_SEARCH, element: <SearchByIdPage /> },
      { path: ROUTE_FIND, element: <FindByKeywordPage /> },
      { path: ROUTE_TEST, element: <TestPage /> },
    ],
  },
];
