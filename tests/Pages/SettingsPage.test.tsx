import { render, screen } from "@testing-library/react";
import SettingsPage from "../../src/pages/SettingsPage";

describe("SettingsPage", () => {
  it("should render the OCI settings", () => {
    render(<SettingsPage />);

    screen.debug(undefined, Infinity);

    expect(screen.getByText(/^Oracle Cloud Infrastructure$/i));
  });

  it("should render the system settings", () => {
    render(<SettingsPage />);

    expect(screen.getByText(/^System$/i));
  });
});
