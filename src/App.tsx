import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./layouts/Index";
import { lazy, Suspense } from "react";
import Skeleton from "./components/Skeleton";

const Dashboard = lazy(() => import("./layouts/dashboard/Index"));
const Banner = lazy(() => import("./layouts/banner/Index"));
const Product = lazy(() => import("./layouts/product/Index"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<Skeleton />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: "banner",
        element: (
          <Suspense fallback={<Skeleton />}>
            <Banner />
          </Suspense>
        ),
      },
      {
        path: "produk",
        element: (
          <Suspense fallback={<Skeleton />}>
            <Product />
          </Suspense>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
