import { fireEvent, screen } from "@testing-library/react";
import { renderRoute } from "../utils/utils";
import {
  DT_REPOSITORY,
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
  DT_STARTUP,
  DT_TUTORIALS,
  ROUTE_ROOT,
} from "../../src/utils/constants";

describe("Sidebar", () => {
  it('should contain the "Tut-O-Pedia" menu item', () => {
    renderRoute(ROUTE_ROOT);

    expect(screen.getByText(/^Tutopedia$/i)).toBeInTheDocument();
  });

  it("should render the 'startup page' when menu 'Tut-O-Pedia' is clicked", () => {
    renderRoute(ROUTE_ROOT);

    const homeButton = screen.getByTestId(DT_SIDEBAR_TUTOPEDIA);
    fireEvent.click(homeButton);

    expect(screen.getByTestId(DT_STARTUP)).toBeInTheDocument();
  });

  it('should contain the "Home" menu item', () => {
    renderRoute(ROUTE_ROOT);

    expect(screen.getByText(/^Home$/i)).toBeInTheDocument();
  });

  it("should render the 'home sub menu' when menu 'Home menu item' is clicked", () => {
    renderRoute(ROUTE_ROOT);

    const homeButton = screen.getByTestId(DT_SIDEBAR_HOME);
    fireEvent.click(homeButton);

    expect(screen.getByText(/^All Tutorials$/)).toBeInTheDocument();
    expect(screen.getByText(/^Published$/)).toBeInTheDocument();
    expect(screen.getByText(/^Unpublished$/)).toBeInTheDocument();
  });

  it("should render the 'Tutorials page' when menu 'All tutorials' is clicked", () => {
    renderRoute(ROUTE_ROOT);

    const homeButton = screen.getByTestId(DT_SIDEBAR_HOME);
    fireEvent.click(homeButton);

    const allButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_ALL);
    fireEvent.click(allButton);

    expect(screen.getByTestId(DT_TUTORIALS)).toBeInTheDocument();
  });

  it("should render the 'Tutorials page' when menu 'Published' is clicked", () => {
    renderRoute(ROUTE_ROOT);

    const homeButton = screen.getByTestId(DT_SIDEBAR_HOME);
    fireEvent.click(homeButton);

    const allButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_PUB);
    fireEvent.click(allButton);

    expect(screen.getByTestId(DT_TUTORIALS)).toBeInTheDocument();
  });

  it("should render the 'Tutorials page' when menu 'Unpublished' is clicked", () => {
    renderRoute(ROUTE_ROOT);

    const homeButton = screen.getByTestId(DT_SIDEBAR_HOME);
    fireEvent.click(homeButton);

    const allButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_UNPUB);
    fireEvent.click(allButton);

    expect(screen.getByTestId(DT_TUTORIALS)).toBeInTheDocument();
  });

  it('should contain the "Create" menu item', () => {
    renderRoute(ROUTE_ROOT);

    expect(screen.getByText(/^Create$/i)).toBeInTheDocument();
  });

  it("should render the 'create page' when menu 'Tut-O-Pedia' is clicked", () => {
    renderRoute(ROUTE_ROOT);

    const createButton = screen.getByTestId(DT_SIDEBAR_CREATE);

    fireEvent.click(createButton);

    expect(screen.getByText(/^Create tutorial$/)).toBeInTheDocument();
  });

  it('should contain the "Find" menu item', () => {
    renderRoute(ROUTE_ROOT);

    expect(screen.getByText(/^Find$/i)).toBeInTheDocument();
  });

  it("should render the 'find sub menu' when menu 'Find menu item' is clicked", () => {
    renderRoute(ROUTE_ROOT);

    const findButton = screen.getByTestId(DT_SIDEBAR_FIND);
    fireEvent.click(findButton);

    expect(screen.getByText(/^By Id$/)).toBeInTheDocument();
    expect(screen.getByText(/^By Keywords$/)).toBeInTheDocument();
  });

  it("should render the 'SearchById page' when menu 'By Id' is clicked", () => {
    renderRoute(ROUTE_ROOT);

    const findButton = screen.getByTestId(DT_SIDEBAR_FIND);
    fireEvent.click(findButton);

    const searchByIdButton = screen.getByTestId(DT_SIDEBAR_SEARCH_ID);
    fireEvent.click(searchByIdButton);

    expect(screen.getByText(/^Search tutorial by ID$/)).toBeInTheDocument();
  });

  it("should render the 'FindByKeyword page' when menu 'By Keywords' is clicked", () => {
    renderRoute(ROUTE_ROOT);

    const findButton = screen.getByTestId(DT_SIDEBAR_FIND);
    fireEvent.click(findButton);

    const findByKeywordsButton = screen.getByTestId(DT_SIDEBAR_FIND_KEYWORD);
    fireEvent.click(findByKeywordsButton);

    expect(screen.getByText(/^Find by keywords$/)).toBeInTheDocument();
  });

  it('should contain the "Cloud" menu item', () => {
    renderRoute(ROUTE_ROOT);

    expect(screen.getByText(/^Cloud$/i)).toBeInTheDocument();
  });

  it("should render the 'cloud sub menu' when menu 'Cloud menu item' is clicked", () => {
    renderRoute(ROUTE_ROOT);

    const cloudButton = screen.getByTestId(DT_SIDEBAR_CLOUD);
    fireEvent.click(cloudButton);

    expect(screen.getByText(/^Settings$/)).toBeInTheDocument();
    expect(screen.getByText(/^Repository$/)).toBeInTheDocument();
  });

  it("should render the 'Settings page' when menu 'Settings' is clicked", () => {
    renderRoute(ROUTE_ROOT);

    const cloudButton = screen.getByTestId(DT_SIDEBAR_CLOUD);
    fireEvent.click(cloudButton);

    const settingsButton = screen.getByTestId(DT_SIDEBAR_CLOUD_SETTINGS);
    fireEvent.click(settingsButton);

    expect(screen.getByText(/^Settings Page$/)).toBeInTheDocument();
  });

  it("should render the 'Repository page' when menu 'Repository' is clicked", () => {
    renderRoute(ROUTE_ROOT);

    const cloudButton = screen.getByTestId(DT_SIDEBAR_CLOUD);
    fireEvent.click(cloudButton);

    const repositoryButton = screen.getByTestId(DT_SIDEBAR_CLOUD_REPOSITORY);
    fireEvent.click(repositoryButton);

    expect(screen.getByTestId(DT_REPOSITORY)).toBeInTheDocument();
  });

  it('should contain the "Media Types" menu item', () => {
    renderRoute(ROUTE_ROOT);

    expect(screen.getByText(/^Media Types$/i)).toBeInTheDocument();
  });

  it("should render the 'socila media sub menu' when menu 'Social Media menu item' is clicked", () => {
    renderRoute(ROUTE_ROOT);

    const mediaButton = screen.getByTestId(DT_SIDEBAR_SOCIAL_MEDIA);
    fireEvent.click(mediaButton);

    expect(screen.getByText(/^Facebook$/)).toBeInTheDocument();
    expect(screen.getByText(/^GMail$/)).toBeInTheDocument();
    expect(screen.getByText(/^Twitter$/)).toBeInTheDocument();
    expect(screen.getByText(/^LinkedIn$/)).toBeInTheDocument();
    expect(screen.getByText(/^Instagram$/)).toBeInTheDocument();
    expect(screen.getByText(/^WhatsApp$/)).toBeInTheDocument();
  });
});
