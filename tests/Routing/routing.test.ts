import { screen } from "@testing-library/react";
import {
  DT_ROOT,
  DT_STARTUP,
  DT_TUTORIALS,
  PSETTINGS,
  ROUTE_CREATE,
  ROUTE_FIND,
  ROUTE_ROOT,
  ROUTE_SEARCH,
  ROUTE_SETTINGS,
  ROUTE_TUTORIALS,
} from "../../src/utils/constants";
import { renderRoute } from "../utils/utils";

describe("Routing", () => {
  it("should render the root page (as it is the master page)", () => {
    renderRoute(ROUTE_ROOT);

    // screen.debug(undefined, Infinity);

    expect(screen.getByTestId(DT_ROOT)).toBeInTheDocument();
  });

  it("should render the startup page as it is the default outlet page in root", () => {
    renderRoute(ROUTE_ROOT);

    expect(screen.getByTestId(DT_STARTUP)).toBeInTheDocument();
  });

  it("should render the settings page", () => {
    renderRoute(ROUTE_SETTINGS);

    expect(screen.getByText(/^Settings Page$/)).toBeInTheDocument();
  });

  it("should render the create page", () => {
    renderRoute(ROUTE_CREATE);

    expect(screen.getByText(/^Create tutorial$/)).toBeInTheDocument();
  });

  it("should render the search by id page", () => {
    renderRoute(ROUTE_SEARCH);

    expect(screen.getByText(/^Search tutorial by ID$/)).toBeInTheDocument();
  });

  it("should render the find by keywords page", () => {
    renderRoute(ROUTE_FIND);

    expect(screen.getByText(/^Find by keywords$/)).toBeInTheDocument();
  });

  it("should render the tutorials page", () => {
    renderRoute(ROUTE_TUTORIALS);

    expect(screen.getByTestId(DT_TUTORIALS)).toBeInTheDocument();
  });
});
