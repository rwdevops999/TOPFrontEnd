import { NavigationState, TutopediaState } from "../appdata/appdata";

export const buildStateForStartup = (
  tutopedia: TutopediaState
): NavigationState => {
  return {
    state: { tutopedia: tutopedia },
  };
};
