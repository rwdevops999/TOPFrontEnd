import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "../../src/routes/routes";
import { render } from "@testing-library/react";
import { useAuth0, User } from "@auth0/auth0-react";

export const renderRoute = (url: string) => {
  const router = createMemoryRouter(routes, {
    initialEntries: [url],
  });

  // render(<RouterProvider router={router} />, { wrapper: AllProviders });
  render(<RouterProvider router={router} />);
};

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | undefined;
};

export const mockAuthState = (authState: AuthState) => {
  vi.mocked(useAuth0).mockReturnValue({
    ...authState,
    getAccessTokenSilently: vi.fn().mockResolvedValue("a"),
    getAccessTokenWithPopup: vi.fn(),
    getIdTokenClaims: vi.fn(),
    loginWithRedirect: vi.fn(),
    loginWithPopup: vi.fn(),
    logout: vi.fn(),
    handleRedirectCallback: vi.fn(),
  });
};
