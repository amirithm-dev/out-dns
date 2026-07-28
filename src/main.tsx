import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { LogProvider } from "./contexts/log-context";
import { PopupProvider } from "./contexts/popup-context";
import { ConfigProvider } from "./contexts/configs-context";
import DNSProvider from "./contexts/dns-context";
import InterfaceProvider from "./contexts/interface-context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>

    <PopupProvider>
      <LogProvider>
        <ConfigProvider>
          <InterfaceProvider>
            <DNSProvider>

              <App />

            </DNSProvider>
          </InterfaceProvider>
        </ConfigProvider>
      </LogProvider>
    </PopupProvider>

  </React.StrictMode>,
);
