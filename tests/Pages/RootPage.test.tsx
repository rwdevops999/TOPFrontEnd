import { screen } from "@testing-library/react";
import { renderRoute } from "../utils/utils";
import { DT_FOOTER, DT_HEADER, ROUTE_ROOT } from "../../src/utils/constants";

describe("RootPage", () => {
  it("should render the header", () => {
    renderRoute(ROUTE_ROOT);

    expect(screen.getByTestId(DT_HEADER)).toBeInTheDocument();
  });

  it("should render the footer", () => {
    renderRoute(ROUTE_ROOT);

    expect(screen.getByTestId(DT_FOOTER)).toBeInTheDocument();
  });
});
