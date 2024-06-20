import { createBrowserRouter } from "react-router-dom";
import App from "../pages/app";
import Home from "../pages/home";

const AppRouter = createBrowserRouter([
  {
    path: '',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      }
    ]
  }
])

export default AppRouter;