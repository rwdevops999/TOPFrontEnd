import { fireEvent, screen, waitFor } from "@testing-library/react";
import { DT_TUTORIALS, ROUTE_FIND } from "../../src/utils/constants";
import { renderRoute } from "../utils/utils";
import userEvent from "@testing-library/user-event";
import { createTutorials } from "../msw/database";

describe("FindByKeyword", () => {
  it("should render the cancel button", () => {
    renderRoute(ROUTE_FIND);

    screen.debug(undefined, Infinity);

    expect(screen.getByText(/^Cancel$/i)).toBeInTheDocument();
  });

  it("should render the tutorials page when cancel is clicked", () => {
    renderRoute(ROUTE_FIND);

    const cancelButton = screen.getByRole("button", { name: /^Cancel$/i });
    fireEvent.click(cancelButton);

    expect(screen.getByTestId("DT_TUTORIALS")).toBeInTheDocument();
  });

  it("should render the search button", () => {
    renderRoute(ROUTE_FIND);

    expect(screen.getByText(/^Search$/i)).toBeInTheDocument();
  });

  it("should render that there are 5 keywords left", () => {
    renderRoute(ROUTE_FIND);

    expect(screen.getByText(/5 keywords left/)).toBeInTheDocument();
  });

  it("should render that there are 3 keywords left when two keywords are entered", async () => {
    renderRoute(ROUTE_FIND);

    await waitFor(async () => {
      const inputField = screen.getByPlaceholderText(
        /Enter keyword and press enter/
      );
      await userEvent.type(inputField, "World[enter]");
    });

    await waitFor(async () => {
      const inputField = screen.getByPlaceholderText(
        /Enter keyword and press enter/
      );
      await userEvent.type(inputField, "World2[enter]");
    });

    expect(screen.getByText(/3 keywords left/)).toBeInTheDocument();
  });

  it("should render changed chip value when clicking 2x on the chip and a something", async () => {
    renderRoute(ROUTE_FIND);

    await waitFor(async () => {
      const inputField = screen.getByPlaceholderText(
        /Enter keyword and press enter/
      );
      await userEvent.type(inputField, "World[enter]");
    });

    await waitFor(async () => {
      const chipField = screen.getByRole("button", { name: /World/ });
      await fireEvent.doubleClick(chipField);

      const inputField = screen.getByPlaceholderText(
        /Enter keyword and press enter/
      );
      await userEvent.type(inputField, "2[enter]");
    });

    expect(screen.getByText(/World2/)).toBeInTheDocument();
  });

  it("should tell that keywords must be defined", async () => {
    renderRoute(ROUTE_FIND);

    await waitFor(async () => {
      const searchButton = screen.getByRole("button", { name: /^Search$/i });
      await fireEvent.click(searchButton);
    });

    screen.debug(undefined, Infinity);

    expect(screen.getByText(/Keywords must be defined/)).toBeInTheDocument();
  });

  it("should render an error message if less then 2 characted are filled in the chip field", async () => {
    renderRoute(ROUTE_FIND);

    await waitFor(async () => {
      const inputField = screen.getByPlaceholderText(
        /Enter keyword and press enter/
      );
      await userEvent.type(inputField, "a[enter]");
    });

    expect(
      screen.getByText(/the value must be at least 2 characters long/i)
    ).toBeInTheDocument();
  });

  it("should render no tutorials if no match is found", async () => {
    createTutorials(1, true, {
      id: 123,
      title: "Tutorial123",
      description: "Description123",
      published: false,
      filename: "File123",
    });

    renderRoute(ROUTE_FIND);

    await waitFor(async () => {
      const inputField = screen.getByPlaceholderText(
        /Enter keyword and press enter/
      );
      await userEvent.type(inputField, "100[enter]");

      const searchButton = screen.getByRole("button", { name: /^Search$/i });
      await fireEvent.click(searchButton);
    });

    screen.debug(undefined, Infinity);

    expect(screen.getByTestId(DT_TUTORIALS)).toBeInTheDocument();
    expect(screen.queryByTestId(/Tutorial100/)).toBeFalsy();
  });

  it("should render a tutorial if a match is found", async () => {
    createTutorials(1, true, {
      id: 123,
      title: "Tutorial123",
      description: "Description123",
      published: false,
      filename: "File123",
    });

    renderRoute(ROUTE_FIND);

    await waitFor(async () => {
      const inputField = screen.getByPlaceholderText(
        /Enter keyword and press enter/
      );
      await userEvent.type(inputField, "123[enter]");

      const searchButton = screen.getByRole("button", { name: /^Search$/i });
      await fireEvent.click(searchButton);
    });

    expect(screen.getByTestId(DT_TUTORIALS)).toBeInTheDocument();
    expect(screen.getByText(/Tutorial123/)).toBeInTheDocument();
  });
});
