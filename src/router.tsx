import React from "react";
import { Navigate } from "react-router-dom";
import { RouteObject } from "react-router";
import LoginPage from "./pages/Login/LoginPage";
import Overview from "./pages/Overview";
import SidebarLayout from "./layouts/SidebarLayout";
import { ReportsPage } from "./pages/Reports/ReportsPage";
import { TrainPage } from "./pages/Train/TrainPage";
import PrivateRoute from "./pages/Auth/PrivateRoute";
import { OutputsPage } from "./pages/Outputs/OutputsPage";
import { CamerasPage } from "./pages/Cameras/CamerasPage";
import { MesPage } from "./pages/MES/MesPage";
import { MachinesPage } from "./pages/Machines/MachinesPage";
import { FalsePositivesPage } from "./pages/Reports/FalsePositives/FalsePositivesPage";
import { MesTrainPage } from "./pages/MES/MesTrain/MesTrainPage";

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
        path: "reports",
        element: (
          <PrivateRoute>
            <ReportsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "false-positives",
        element: (
          <PrivateRoute>
            <FalsePositivesPage />
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
        path: "outputs",
        element: (
          <PrivateRoute>
            <OutputsPage />
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
        path: "machines",
        element: (
          <PrivateRoute>
            <MachinesPage />
          </PrivateRoute>
        ),
      },
    ],
  },

  { path: "auth/signin", element: <LoginPage /> },
];

export default routes;
