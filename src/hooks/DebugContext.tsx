import { createContext } from "react";

const DebugContext = createContext({
  debug: true,
  setDebug: (_b: boolean) => {},
});

export default DebugContext;
