import { createRoot } from "react-dom/client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import axios from "axios";

import App from "./App.tsx";
import TestPage from "./pages/TestPage.tsx";

axios.defaults.baseURL = "http://localhost:8081/api";

const repo: Repository = {
  id: 1,
  name: "test",
  selected: false,
  favorite: false,
  updateDate: new Date(),
  tutorials: 0,
};

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    {/* <TestPage2 repository={repo} /> */}
    {/* <RepositoryContainer repository={repo} /> */}
  </>
);
