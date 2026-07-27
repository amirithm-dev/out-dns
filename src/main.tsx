import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { LogProvider } from "./contexts/log-context";
import { PopupProvider } from "./contexts/popup-context";
import { ConfigProvider } from "./contexts/configs-context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>

    <PopupProvider>
      <LogProvider>
        <ConfigProvider>

          <App />
          
        </ConfigProvider>
      </LogProvider>
    </PopupProvider>

  </React.StrictMode>,
);
