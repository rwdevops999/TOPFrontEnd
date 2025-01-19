import { useContext } from "react";
import DebugContext from "./DebugContext";

export default function useDebugContext() {
  return useContext(DebugContext); // This causes the error
}
