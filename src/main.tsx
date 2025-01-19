import { createRoot } from "react-dom/client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import axios from "axios";

import App from "./App.tsx";

axios.defaults.baseURL = "http://localhost:8081/api";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
  </>
);
