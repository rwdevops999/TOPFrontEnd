import {
  fireEvent,
  getByRole,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { renderRoute } from "../utils/utils";
import { ROUTE_TEST } from "../../src/utils/constants";
import { log } from "../../src/utils/log";

describe("TestPage", () => {
  it("should render", async () => {
    renderRoute(ROUTE_TEST);

    screen.debug(undefined, Infinity);

    const button = screen.getByRole("button", { name: /^Click Me$/ });
    await waitFor(() => fireEvent.click(button));
  });
});
