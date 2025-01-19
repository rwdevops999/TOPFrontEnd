import "@testing-library/jest-dom/vitest";
import { configure } from "@testing-library/react";
import { PropsWithChildren, ReactNode } from "react";
import { backend } from "./msw/backend";

configure({ testIdAttribute: "data-title" });

vi.mock("@auth0/auth0-react", () => {
  return {
    useAuth0: vi.fn().mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: undefined,
    }),
    Auth0Provider: ({ children }: PropsWithChildren) => children,
    withAuthenticationRequired: (component: ReactNode) => component,
  };
});

beforeAll(() => backend.listen());
afterEach(() => backend.resetHandlers());
afterAll(() => backend.close());
