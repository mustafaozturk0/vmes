import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import "./translations/i18n";
import { Provider } from "react-redux";
import "nprogress/nprogress.css";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { store } from "./store/Store";
import { SidebarProvider } from "./contexts/SidebarContext";
import { SnackbarProvider } from "notistack";
import App from "./App";
import { SocketContext, socket } from "./contexts/SocketContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <SocketContext.Provider value={socket}>
      <I18nextProvider i18n={i18next}>
        <HelmetProvider>
          <SidebarProvider>
            <BrowserRouter>
              <SnackbarProvider maxSnack={3}>
                <App />
              </SnackbarProvider>
            </BrowserRouter>
          </SidebarProvider>
        </HelmetProvider>
      </I18nextProvider>
    </SocketContext.Provider>
  </Provider>
);
