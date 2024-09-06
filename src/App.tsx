import React, { useEffect, useState } from "react";
import "./App.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useRoutes } from "react-router-dom";
import router from "./router";
import { ThemeModes, useColorModeAndTheme } from "./theme/base";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ColorContext } from "./contexts/ColorContext";
import { PolygonsProvider } from "./contexts/PolygonContext";
import { fetchThemeMode } from "./fetchers/locale-fetcher";
import {
  persistUserAndTokensOnRefresh,
  selectCurrentUser,
} from "./slices/auth/AuthSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./store/hooks";
import { useGetCamerasMutation } from "./api/camera/cameraApi";
import { useGetYoloClassesMutation } from "./api/yolo/yoloApi";

function App() {
  const content = useRoutes(router);
  const [mode, setMode] = useState<ThemeModes>(fetchThemeMode());
  const { colorMode, theme } = useColorModeAndTheme(setMode, mode);
  const dispatch = useAppDispatch();
  const currentUser = useSelector(selectCurrentUser);

  const [getCameras] = useGetCamerasMutation();

  const [getYoloClasses] = useGetYoloClassesMutation();

  useEffect(() => {
    if (!currentUser) persistUserAndTokensOnRefresh(dispatch);
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (currentUser) {
      getCameras();

      getYoloClasses().unwrap();
    }
  }, [currentUser, getCameras]);

  return (
    <PolygonsProvider>
      <ColorContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {content}
          </LocalizationProvider>
        </ThemeProvider>
      </ColorContext.Provider>
    </PolygonsProvider>
  );
}

export default App;
