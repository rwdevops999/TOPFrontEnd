import { render, screen, waitFor } from "@testing-library/react";
import { mockAuthState, renderRoute } from "../utils/utils";
import { User } from "@auth0/auth0-react";
import Footer from "../../src/components/root/footer/Footer";
import { ROUTE_ROOT } from "../../src/utils/constants";
import { createRepositories } from "../msw/database";

/**
 * We don't test for the times
 */

describe("Footer", () => {
  it("should render 'not logged in' when user is not logged in", () => {
    render(<Footer repoName={"test"} />);

    expect(screen.getByText(/^not logged in$/)).toBeInTheDocument();
  });

  it("should render the use name when user is logged in", () => {
    let user: User = {
      name: "testuser",
    };

    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: user,
    });

    render(<Footer repoName={"test"} />);

    expect(screen.getByText(/^testuser$/)).toBeInTheDocument();
  });

  it("should render 'Not Set' if no default repository is created", () => {
    renderRoute(ROUTE_ROOT);

    expect(screen.getByText(/^Not Set$/)).toBeInTheDocument();
  });

  it("should render the default repository name if a default repository is created", async () => {
    createRepositories(1, true, {
      name: "DefaultRepo",
      selected: true,
    });

    renderRoute(ROUTE_ROOT);

    await waitFor(() =>
      expect(screen.getByText(/^DefaultRepo$/)).toBeInTheDocument()
    );
  });
});
