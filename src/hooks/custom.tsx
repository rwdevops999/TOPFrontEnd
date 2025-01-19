import {
  Data,
  HeaderState,
  NavigationState,
  TutopediaState,
} from "../appdata/appdata";
import { TITLE } from "../utils/constants";
import { log } from "../utils/log";

export const useTutopedia = (state: NavigationState): TutopediaState => {
  let tutopedia: TutopediaState;
  if (state && state.state) {
    tutopedia = state.state.tutopedia;
    log(true, "UseTutopedia", "tutopedia", tutopedia, true);
    return tutopedia;
  }

  return {
    count: 0,
    routeUrl: "not set",
    sender: "Not Set",
  };
};

export const useHeader = (state: any): HeaderState => {
  let header: HeaderState;
  if (state === null || state.tutopedia === null) {
    return {
      title: TITLE,
      subtitle: "Home",
    };
  }

  if (state.tutopedia.header) {
    header = state.tutopedia.header;
    return header;
  }

  return {
    title: "not set",
    subtitle: "not set",
  };
};

export const useData = (state: any): Data => {
  let data: Data;
  console.log("USE STATE:" + state);
  if (state === null || state.tutopedia === null) {
    return {
      reloadData: false,
      errorMessage: "",
      updateMode: false,
      // updateId?: number;
      // viewmode?: "All" | "Pub" | "Unpub" | "id" | "keyword";
      // searchId?: number;
      // keywords?: string[];
    };
  }

  if (state.tutopedia.data) {
    data = state.tutopedia.data;
    return data;
  }

  return {};
};
