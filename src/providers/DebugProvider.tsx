import { useState } from "react";
import DebugContext from "../hooks/DebugContext";

const DebugProvider = ({ children }: { children: any }) => {
  const [debug, setDebug] = useState(true);

  return (
    <DebugContext.Provider
      value={{
        debug,
        setDebug,
      }}
    >
      {children}
    </DebugContext.Provider>
  );
};

export default DebugProvider;
