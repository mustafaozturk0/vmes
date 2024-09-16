import React from "react";
import { Navigate } from "react-router-dom";
import { RouteObject } from "react-router";
import LoginPage from "./pages/Login/LoginPage";
import Overview from "./pages/Overview";
import SidebarLayout from "./layouts/SidebarLayout";
import { TrainPage } from "./pages/Train/TrainPage";
import PrivateRoute from "./pages/Auth/PrivateRoute";
import { CamerasPage } from "./pages/Cameras/CamerasPage";
import { MesPage } from "./pages/MES/MesPage";
import { MesTrainPage } from "./pages/MES/MesTrain/MesTrainPage";
import { VggPage } from "./pages/Vgg/VggPage";

const routes: RouteObject[] = [
  {
    path: "",
    element: <SidebarLayout />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <Overview />
          </PrivateRoute>
        ),
      },
      {
        path: "overview",
        element: (
          <PrivateRoute>
            <Navigate to="/" replace />
          </PrivateRoute>
        ),
      },
      {
        path: "train",
        element: (
          <PrivateRoute>
            <MesTrainPage />
          </PrivateRoute>
        ),
      },
      {
        path: "cameras",
        element: (
          <PrivateRoute>
            <CamerasPage />
          </PrivateRoute>
        ),
      },
      {
        path: "vmes",
        element: (
          <PrivateRoute>
            <MesPage />
          </PrivateRoute>
        ),
      },
      {
        path: "vgg",
        element: <VggPage />,
      },
    ],
  },

  { path: "auth/signin", element: <LoginPage /> },
];

export default routes;
