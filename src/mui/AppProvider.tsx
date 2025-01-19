import { ReactNode } from "react";
import { NavigationContext } from "./shared/context";

export interface NavigationPageItem {
  id?: string;
  kind?: "page";
  segment?: string;
  title?: string;
  icon?: React.ReactNode;
  href?: string;
  children?: Navigation;
  datatitle?: string;
}

export interface NavigationSubheaderItem {
  kind: "header";
  title: string;
}

export interface NavigationDividerItem {
  kind: "divider";
}

export type NavigationItem =
  | NavigationPageItem
  | NavigationSubheaderItem
  | NavigationDividerItem;

export type Navigation = NavigationItem[];

export interface AppProviderProps {
  children: ReactNode;
  navigation?: Navigation;
}

const AppProvider = (props: AppProviderProps) => {
  const { children, navigation = [] } = props;

  return (
    <NavigationContext.Provider value={navigation}>
      {children}
    </NavigationContext.Provider>
  );
};

export default AppProvider;
