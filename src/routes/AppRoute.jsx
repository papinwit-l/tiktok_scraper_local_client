import React from "react";
import MainLayout from "../layouts/MainLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import GetTags from "@/pages/GetTags";
import ViewTags from "@/pages/ViewTags";
import ViewAllUser from "@/pages/ViewAllUser";
import DataSync from "@/pages/DataSync";
import SyncAndExport from "@/pages/SyncAndExport";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/get-tags",
        element: <GetTags />,
      },
      {
        path: "/view-tags",
        element: <ViewTags />,
      },
      {
        path: "/view-all-users",
        element: <ViewAllUser />,
      },
      {
        path: "/sync-and-export",
        element: <SyncAndExport />,
      },
      // {
      //   path: "/data-sync",
      //   element: <DataSync />,
      // },
    ],
  },
]);

const AppRoute = () => {
  return <RouterProvider router={router} />;
};

export default AppRoute;
