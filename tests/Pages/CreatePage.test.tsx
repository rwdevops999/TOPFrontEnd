import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import {
  DT_SIDEBAR_HOME,
  DT_SIDEBAR_TUTORIALS_ALL,
  DT_TUTORIALS_ITEM,
  ROUTE_CREATE,
  ROUTE_ROOT,
} from "../../src/utils/constants";
import { renderRoute } from "../utils/utils";
import { act } from "react";
import user from "@testing-library/user-event";
import { simulateCreateDummyTutorial } from "../msw/backend";
import { createTutorials } from "../msw/database";
import { log } from "../../src/utils/log";

const createLongString = (): string => {
  return "x".repeat(300);
};

describe("CreatePage", () => {
  it("should render the 'Create Tutorial' title", () => {
    renderRoute(ROUTE_CREATE);

    expect(screen.getByText(/^Create tutorial$/)).toBeInTheDocument();
  });

  it("should render the Cancel Button", () => {
    renderRoute(ROUTE_CREATE);

    expect(screen.getByText(/^CANCEL$/)).toBeInTheDocument();
  });

  it("should render the input fields", () => {
    renderRoute(ROUTE_CREATE);

    expect(screen.getByText(/^Title$/)).toBeInTheDocument();
    expect(screen.getByText(/^Description$/)).toBeInTheDocument();
    expect(screen.getByText(/^Upload files$/)).toBeInTheDocument();
  });

  it("should give a validation error for the title field is create button is clicked", async () => {
    renderRoute(ROUTE_CREATE);

    const createButton = screen.getByRole("button", { name: /^CREATE$/ });
    await act(async () => {
      await fireEvent.click(createButton);
    });

    expect(screen.getByText(/^title is required$/i)).toBeInTheDocument();
  });

  it("should give a validation error on title if field is filled in more than 255 characters and if create button is clicked", async () => {
    renderRoute(ROUTE_CREATE);

    const textbox = screen.getByRole("textbox", { name: /title/i });
    fireEvent.change(textbox, { target: { value: createLongString() } });

    const button = screen.getByRole("button", { name: /^CREATE$/ });
    await act(async () => {
      await fireEvent.click(button);
    });

    expect(
      screen.queryByText(/Maximal title length is 255 characters/i)
    ).toBeInTheDocument();
  });

  it("should give no validation error on title if field is filled in and if create button is clicked", async () => {
    renderRoute(ROUTE_CREATE);

    const textbox = screen.getByRole("textbox", { name: /title/i });
    fireEvent.change(textbox, { target: { value: "Hello" } });

    const createButton = screen.getByRole("button", { name: /^CREATE$/ });
    await act(async () => {
      await fireEvent.click(createButton);
    });

    expect(screen.queryByText(/title is required/i)).toBeNull();
  });

  it("should give a validation error for the description field is create button is clicked", async () => {
    renderRoute(ROUTE_CREATE);

    const createButton = screen.getByRole("button", { name: /^CREATE$/ });
    await act(async () => {
      await fireEvent.click(createButton);
    });

    expect(screen.getByText(/^description is required$/i)).toBeInTheDocument();
  });

  it("should give a validation error on description if field is filled in more than 255 characters and if create button is clicked", async () => {
    renderRoute(ROUTE_CREATE);

    const textbox = screen.getByRole("textbox", { name: /description/i });
    fireEvent.change(textbox, { target: { value: createLongString() } });

    const button = screen.getByRole("button", { name: /^CREATE$/ });
    await act(async () => {
      await fireEvent.click(button);
    });

    expect(
      screen.queryByText(/Maximal description length is 255 characters/i)
    ).toBeInTheDocument();
  });

  it("should give no validation error on description if field is filled in and if create button is clicked", async () => {
    renderRoute(ROUTE_CREATE);

    const textbox = screen.getByRole("textbox", { name: /description/i });
    fireEvent.change(textbox, { target: { value: "Hello" } });

    const createButton = screen.getByRole("button", { name: /^CREATE$/ });
    await act(async () => {
      await fireEvent.click(createButton);
    });

    expect(screen.queryByText(/description is required/i)).toBeNull();
  });

  it("should give a validation error for the unselected file is create button is clicked", async () => {
    renderRoute(ROUTE_CREATE);

    const createButton = screen.getByRole("button", { name: /^CREATE$/ });
    await act(async () => {
      await fireEvent.click(createButton);
    });

    expect(screen.getByText(/^file is required$/i)).toBeInTheDocument();
  });

  it("should give no validation error on file if file is uploaded and if create button is clicked", async () => {
    renderRoute(ROUTE_CREATE);

    const content = "";
    const file = new File([content], "upload.csv", {
      type: "text/csv",
    });

    const fileUploadButton = screen.getByLabelText(/upload files/i);

    await act(async () => {
      await user.upload(fileUploadButton, file);
    });

    const button = screen.getByRole("button", { name: /^CREATE$/ });
    await act(async () => {
      await fireEvent.click(button);
    });

    expect(screen.queryByText(/File is required/i)).toBeNull();
  });

  it("should give a validation error on file if filename is more than 255 characters and if create button is clicked", async () => {
    renderRoute(ROUTE_CREATE);

    const content = "";
    const file = new File([content], createLongString() + ".csv", {
      type: "text/csv",
    });

    const fileUploadButton = screen.getByLabelText(/upload files/i);

    await act(async () => {
      await user.upload(fileUploadButton, file);
    });

    const button = screen.getByRole("button", { name: /^CREATE$/ });
    await act(async () => {
      await fireEvent.click(button);
    });

    const info = screen.queryByText(
      /Maximal filename length is 255 characters/i
    );
    expect(info).toBeInTheDocument();
  });

  it("should follow the happy page route when clicking the create button", async () => {
    simulateCreateDummyTutorial("http://localhost:8081/api/create");

    renderRoute(ROUTE_CREATE);

    // SET a valid title
    let textbox = screen.getByRole("textbox", { name: /title/i });
    fireEvent.change(textbox, { target: { value: "This is a title" } });

    // SET a valid description
    textbox = screen.getByRole("textbox", { name: /description/i });
    fireEvent.change(textbox, { target: { value: "This is a description" } });

    // upload a file
    const content = "";
    const file = new File([content], "ThisIsAFile.csv", {
      type: "text/csv",
    });
    const fileUploadButton = screen.getByLabelText(/upload files/i);
    await user.upload(fileUploadButton, file);

    await waitFor(async () => {
      const createButton = screen.getByRole("button", { name: /^CREATE$/ });
      await fireEvent.click(createButton);
    });

    screen.debug(undefined, Infinity);

    expect(screen.getByText(/Test1/)).toBeInTheDocument();
  });

  describe("UpdatePage", () => {
    beforeEach(async () => {
      createTutorials(1, true, {
        title: "Title1",
        description: "Description1",
        filename: "File1",
      });

      renderRoute(ROUTE_ROOT);

      const homeButton = screen.getByTestId(DT_SIDEBAR_HOME);
      fireEvent.click(homeButton);

      await waitFor(async () => {
        const allButton = screen.getByTestId(DT_SIDEBAR_TUTORIALS_ALL);
        fireEvent.click(allButton);
      });

      let tutorials = screen.getAllByTestId(DT_TUTORIALS_ITEM);
      const menu = within(tutorials[0]).getByRole("menu");

      await waitFor(async () => {
        const editMenuItem = within(menu).getByRole("menuitem", {
          name: /Edit/,
        });
        await fireEvent.click(editMenuItem);
      });
    });

    it("should render the 'Update tutorial' title", () => {
      expect(screen.getByText(/^Update tutorial$/)).toBeInTheDocument();
    });

    it("should render the 'title field value' containing the title", () => {
      const textbox: HTMLInputElement = screen.getByRole("textbox", {
        name: /title/i,
      }) as HTMLInputElement;

      expect(textbox.value).toBe("Title1");
    });

    it("should render the 'description field value' containing the description", () => {
      const textbox: HTMLInputElement = screen.getByRole("textbox", {
        name: /description/i,
      }) as HTMLInputElement;

      expect(textbox.value).toBe("Description1");
    });

    it("should render the 'filename field value' containing the filename", () => {
      expect(screen.getByText(/^File1$/)).toBeInTheDocument();
    });

    // it("should give no validation error on title if update button is clicked", async () => {});
  });
});
