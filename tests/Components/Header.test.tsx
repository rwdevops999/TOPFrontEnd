import { render, screen } from "@testing-library/react";
import { User } from "@auth0/auth0-react";
import { mockAuthState } from "../utils/utils";
import Header from "../../src/components/root/header/Header";

describe("Header", () => {
  it("should render the title", () => {
    render(<Header title="test" />);

    expect(screen.getByText(/^test$/)).toBeInTheDocument();
  });

  it("should render the login button when not authenticated", () => {
    render(<Header />);

    expect(screen.getByText(/^login$/i)).toBeInTheDocument();
  });

  it("should render the logout button when authenticated", () => {
    let user: User = {
      name: "testuser",
    };

    mockAuthState({
      isLoading: false,
      isAuthenticated: true,
      user: user,
    });

    render(<Header />);

    expect(screen.getByText(/^logout$/i)).toBeInTheDocument();
  });
});
