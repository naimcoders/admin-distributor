import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
