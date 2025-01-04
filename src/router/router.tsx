import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../pages/app";
import Home from "../pages/home";
import Main from "@/pages/main";
import Ranking from "@/pages/ranking";
import Refferal from "@/pages/refferal";
import Launcher from "@/pages/launcher";

const AppRouter = createBrowserRouter([
  {
    path: '',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Main />,
        children: [
          {
            index: true,
            element: <Home />
          },
          {
            path: 'launcher',
            element: <Launcher />
          },
          {
            path: 'refferal',
            element: <Refferal />
          },
          {
            path: 'ranking',
            element: <Ranking />
          },
        ]
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ]
  }
])

export default AppRouter;