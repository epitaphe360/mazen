import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { I18nProvider } from "./lib/i18n";
import Maintenance from "./pages/Maintenance";

const MAINTENANCE_MODE = false;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {MAINTENANCE_MODE ? (
      <Maintenance />
    ) : (
      <I18nProvider>
        <App />
      </I18nProvider>
    )}
  </React.StrictMode>
);
