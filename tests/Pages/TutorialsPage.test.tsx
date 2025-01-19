import {
  fireEvent,
  getAllByTestId,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { createRepositories, createTutorials } from "../msw/database";
import { renderRoute } from "../utils/utils";
import {
  DT_SIDEBAR_HOME,
  DT_SIDEBAR_TUTORIALS_ALL,
  DT_SIDEBAR_TUTORIALS_PUB,
  DT_SIDEBAR_TUTORIALS_UNPUB,
  DT_SPEEDDIAL,
  DT_TUTORIALS_ITEM,
  ROUTE_ROOT,
} from "../../src/utils/constants";

describe("TutorialsPage", () => {
  it("should render all tutorials", async () => {
    createTutorials(2, true);
    createTutorials(1, false, {
      published: true,
    });

    renderRoute(ROUTE_ROOT);

    const homeButton = screen.getByTestId(DT_SIDEBAR_HOME);
    fireEvent.click(homeButton);

    await waitFor(async () => {
      const allButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_ALL);
      fireEvent.click(allButton);
    });

    const count = screen.getAllByTestId(DT_TUTORIALS_ITEM).length;
    expect(count).toBe(3);
  });

  it("should render all published tutorials", async () => {
    createTutorials(2, true);
    createTutorials(1, false, {
      published: true,
    });

    renderRoute(ROUTE_ROOT);

    const homeButton = screen.getByTestId(DT_SIDEBAR_HOME);
    fireEvent.click(homeButton);

    await waitFor(async () => {
      const allButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_PUB);
      fireEvent.click(allButton);
    });

    const count = screen.getAllByTestId(DT_TUTORIALS_ITEM).length;
    expect(count).toBe(1);
  });

  it("should render all unpublished tutorials", async () => {
    createTutorials(2, true);
    createTutorials(1, false, {
      published: true,
    });

    renderRoute(ROUTE_ROOT);

    const homeButton = screen.getByTestId(DT_SIDEBAR_HOME);
    fireEvent.click(homeButton);

    await waitFor(async () => {
      const allButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_UNPUB);
      fireEvent.click(allButton);
    });

    const count = screen.getAllByTestId(DT_TUTORIALS_ITEM).length;
    expect(count).toBe(2);
  });

  it("should contain a speed dial when a tutorial is unpublished", async () => {
    createTutorials(2, true);

    renderRoute(ROUTE_ROOT);

    const homeButton = screen.getByTestId(DT_SIDEBAR_HOME);
    fireEvent.click(homeButton);

    await waitFor(async () => {
      const allButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_ALL);
      fireEvent.click(allButton);
    });

    const tutorials = screen.getAllByTestId(DT_TUTORIALS_ITEM);

    expect(within(tutorials[0]).getByRole("menu")).toBeInTheDocument();
  });

  it("should delete a tutorial when speed dial delete is clicked", async () => {
    createTutorials(2, true);

    renderRoute(ROUTE_ROOT);

    const homeButton = screen.getByTestId(DT_SIDEBAR_HOME);
    fireEvent.click(homeButton);

    await waitFor(async () => {
      const allButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_ALL);
      fireEvent.click(allButton);
    });

    const tutorials = screen.getAllByTestId(DT_TUTORIALS_ITEM);

    const menu = within(tutorials[0]).getByRole("menu");

    await waitFor(async () => {
      const deleteMenuItem = within(menu).getByRole("menuitem", {
        name: /Delete/,
      });
      await fireEvent.click(deleteMenuItem);
    });

    expect(screen.getAllByTestId(DT_TUTORIALS_ITEM).length).toBe(1);
  });

  it("should edit the tutorial when speed dial edit is clicked", async () => {
    createTutorials(1, true, {
      title: "Tutorial 1",
    });
    createTutorials(1, false, {
      title: "Tutorial 2",
    });

    renderRoute(ROUTE_ROOT);

    const homeButton = screen.getByTestId(DT_SIDEBAR_HOME);
    fireEvent.click(homeButton);

    await waitFor(async () => {
      const allButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_ALL);
      fireEvent.click(allButton);
    });

    const tutorials = screen.getAllByTestId(DT_TUTORIALS_ITEM);

    const menu = within(tutorials[0]).getByRole("menu");

    await waitFor(async () => {
      const editMenuItem = within(menu).getByRole("menuitem", {
        name: /Edit/,
      });
      await fireEvent.click(editMenuItem);
    });

    expect(screen.getByText(/^Update tutorial$/)).toBeInTheDocument();
  });

  it("should not publish the turorial when speed dial publish is selected and no default repository is set", async () => {
    createTutorials(1, true, {
      title: "Tutorial 1",
    });
    createTutorials(1, false, {
      title: "Tutorial 2",
    });

    renderRoute(ROUTE_ROOT);

    const homeButton = screen.getByTestId(DT_SIDEBAR_HOME);
    fireEvent.click(homeButton);

    await waitFor(async () => {
      const allButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_ALL);
      fireEvent.click(allButton);
    });

    const tutorials = screen.getAllByTestId(DT_TUTORIALS_ITEM);

    const menu = within(tutorials[0]).getByRole("menu");

    await waitFor(async () => {
      const publishMenuItem = within(menu).getByRole("menuitem", {
        name: /Publish/,
      });
      await fireEvent.click(publishMenuItem);
    });

    expect(screen.getByText(/^No Default Repository Set$/)).toBeInTheDocument();
  });

  it("should publish the tutorial when speed dial publish is selected and a default repository is set", async () => {
    createTutorials(1, true, {
      title: "Tutorial 1",
    });
    createTutorials(1, false, {
      title: "Tutorial 2",
    });

    createRepositories(1, true, {
      selected: true,
    });

    renderRoute(ROUTE_ROOT);

    const homeButton = screen.getByTestId(DT_SIDEBAR_HOME);
    fireEvent.click(homeButton);

    // First go and see the published tutorials
    await waitFor(async () => {
      const pubButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_PUB);
      fireEvent.click(pubButton);
    });

    let tutorials = screen.queryAllByTestId(DT_TUTORIALS_ITEM);
    expect(tutorials.length).toBe(0);

    fireEvent.click(homeButton);

    // First go and see the published tutorials
    await waitFor(async () => {
      const allButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_ALL);
      fireEvent.click(allButton);
    });

    tutorials = screen.getAllByTestId(DT_TUTORIALS_ITEM);
    expect(tutorials.length).toBe(2);

    const menu = within(tutorials[0]).getByRole("menu");

    await waitFor(async () => {
      const publishMenuItem = within(menu).getByRole("menuitem", {
        name: /Publish/,
      });
      await fireEvent.click(publishMenuItem);
    });

    fireEvent.click(homeButton);

    await waitFor(async () => {
      const pubButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_PUB);
      fireEvent.click(pubButton);
    });

    tutorials = screen.queryAllByTestId(DT_TUTORIALS_ITEM);
    expect(tutorials.length).toBe(1);
  });

  it("should delete all tutorials when delete all speed dial is selected", async () => {
    createTutorials(1, true, {
      title: "Tutorial 1",
    });
    createTutorials(1, false, {
      title: "Tutorial 2",
    });

    renderRoute(ROUTE_ROOT);

    const homeButton = screen.getByTestId(DT_SIDEBAR_HOME);
    fireEvent.click(homeButton);

    await waitFor(async () => {
      const allButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_ALL);
      fireEvent.click(allButton);
    });

    let tutorials = screen.queryAllByTestId(DT_TUTORIALS_ITEM);
    expect(tutorials.length).toBe(2);

    expect(screen.getByTestId(DT_SPEEDDIAL)).toBeInTheDocument();
    const speedDial = screen.getByTestId(DT_SPEEDDIAL);

    const menu = within(speedDial).getByRole("menu");

    await waitFor(async () => {
      const deleteAllMenuItem = within(menu).getByRole("menuitem", {
        name: /Delete All/,
      });
      await fireEvent.click(deleteAllMenuItem);
    });

    tutorials = screen.queryAllByTestId(DT_TUTORIALS_ITEM);
    expect(tutorials.length).toBe(0);
  });

  it.only("should publish all tutorials when publish all speed dial is selected", async () => {
    createTutorials(1, true, {
      title: "Tutorial 1",
    });
    createTutorials(1, false, {
      title: "Tutorial 2",
    });

    renderRoute(ROUTE_ROOT);

    const homeButton = screen.getByTestId(DT_SIDEBAR_HOME);
    fireEvent.click(homeButton);

    await waitFor(async () => {
      const unpubButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_UNPUB);
      fireEvent.click(unpubButton);
    });

    let tutorials = screen.queryAllByTestId(DT_TUTORIALS_ITEM);
    expect(tutorials.length).toBe(2);

    expect(screen.getByTestId(DT_SPEEDDIAL)).toBeInTheDocument();
    const speedDial = screen.getByTestId(DT_SPEEDDIAL);

    const menu = within(speedDial).getByRole("menu");

    await waitFor(async () => {
      const publishAllMenuItem = within(menu).getByRole("menuitem", {
        name: /Publish All/,
      });
      await fireEvent.click(publishAllMenuItem);
    });

    fireEvent.click(homeButton);

    await waitFor(async () => {
      const unpubButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_UNPUB);
      fireEvent.click(unpubButton);
    });

    tutorials = screen.queryAllByTestId(DT_TUTORIALS_ITEM);
    expect(tutorials.length).toBe(0);

    fireEvent.click(homeButton);

    await waitFor(async () => {
      const pubButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_PUB);
      fireEvent.click(pubButton);
    });

    tutorials = screen.queryAllByTestId(DT_TUTORIALS_ITEM);
    expect(tutorials.length).toBe(2);
  });
});
