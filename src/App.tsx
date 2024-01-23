import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./layouts/Index";
import { lazy, Suspense } from "react";
import Skeleton from "./components/Skeleton";

const Dashboard = lazy(() => import("./layouts/dashboard/Index"));
const Banner = lazy(() => import("./layouts/banner/Index"));
const Product = lazy(() => import("./layouts/product/Index"));
const ProductDetail = lazy(() => import("./layouts/product/Detail"));
const Account = lazy(() => import("./layouts/account/Index"));

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
      {
        path: "produk/:id",
        element: (
          <Suspense fallback={<Skeleton />}>
            <ProductDetail />
          </Suspense>
        ),
      },
      {
        path: "akun",
        element: (
          <Suspense fallback={<Skeleton />}>
            <Account />
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
