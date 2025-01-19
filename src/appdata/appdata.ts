export type HeaderState = {
  title: string;
  subtitle?: string;
};

export type FooterState = {};

export type SidebarState = {};

export type TutopediaState = {
  count: number;
  routeUrl: string;
  sender: string;
  message?: string;
  header?: HeaderState;
  footer?: FooterState;
  sidebar?: SidebarState;
  data?: Data;
};

export type LocationState = {
  tutopedia: TutopediaState;
};

export type NavigationState = {
  state: { tutopedia: TutopediaState };
};

export type Data = {
  reloadData?: boolean;
  errorMessage?: string;
  updateMode?: boolean;
  updateId?: number;
  viewmode?: "All" | "Pub" | "Unpub" | "id" | "keyword";
  searchId?: number;
  keywords?: string[];
};

export type HeaderMenuState = {};

export type RepositoryState = {};

export type AppUserState = {};

export type ControlsState = {};

export type PagesState = {};

export type ViewsState = {};

export type SearchState = {};
