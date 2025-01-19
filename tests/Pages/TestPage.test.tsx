import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderRoute } from "../utils/utils";
import { ROUTE_TEST } from "../../src/utils/constants";

describe("TestPage", () => {
  it("should render", async () => {
    renderRoute(ROUTE_TEST);

    screen.debug(undefined, Infinity);

    const button = screen.getByRole("button", { name: /^Click Me$/ });
    await waitFor(() => fireEvent.click(button));
  });
});
