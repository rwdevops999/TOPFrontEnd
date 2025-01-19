import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderRoute } from "../utils/utils";
import {
  DT_SEARCH_PAGE_INPUT,
  DT_TUTORIALS,
  ROUTE_SEARCH,
} from "../../src/utils/constants";
import { createTutorials } from "../msw/database";

describe("SearchPage", () => {
  it("should render the input field", () => {
    renderRoute(ROUTE_SEARCH);

    expect(screen.getByTestId(DT_SEARCH_PAGE_INPUT)).toBeInTheDocument();
  });

  it("should render the cancel button", () => {
    renderRoute(ROUTE_SEARCH);

    expect(screen.getByText(/^Cancel$/i)).toBeInTheDocument();
  });

  it("should render the tutorials page when clicking the cancel button", () => {
    renderRoute(ROUTE_SEARCH);

    const cancelButton = screen.getByRole("button", { name: /^Cancel$/ });
    fireEvent.click(cancelButton);

    expect(screen.getByTestId(DT_TUTORIALS)).toBeInTheDocument();
  });

  it("should render the search button", () => {
    renderRoute(ROUTE_SEARCH);

    expect(screen.getByText(/^Search$/i)).toBeInTheDocument();
  });

  it("should render no tutorial if no match is found", async () => {
    createTutorials(1, true, {
      id: 123,
      title: "Tutorial123",
      description: "Description123",
      published: false,
      filename: "File123",
    });

    renderRoute(ROUTE_SEARCH);

    const inputField = screen.getByTestId(DT_SEARCH_PAGE_INPUT);
    fireEvent.change(inputField, { target: { value: "100" } });

    await waitFor(async () => {
      const searchButton = screen.getByRole("button", { name: /^Search$/ });
      await fireEvent.click(searchButton);
    });

    expect(screen.getByTestId(DT_TUTORIALS)).toBeInTheDocument();
    expect(screen.queryByText(/Tutorial100/i)).toBeFalsy();
  });

  it("should render one tutorial if a match is found", async () => {
    createTutorials(1, true, {
      id: 123,
      title: "Tutorial123",
      description: "Description123",
      published: false,
      filename: "File123",
    });

    renderRoute(ROUTE_SEARCH);

    const inputField = screen.getByTestId(DT_SEARCH_PAGE_INPUT);
    fireEvent.change(inputField, { target: { value: "123" } });

    await waitFor(async () => {
      const searchButton = screen.getByRole("button", { name: /^Search$/ });
      await fireEvent.click(searchButton);
    });

    expect(screen.getByTestId(DT_TUTORIALS)).toBeInTheDocument();
    expect(screen.getByText(/Tutorial123/i)).toBeInTheDocument();
  });
});
