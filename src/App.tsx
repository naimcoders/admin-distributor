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
const DetailSubCategory = lazy(
  () => import("./layouts/product/sub-category/Detail")
);
const Store = lazy(() => import("./layouts/store/Index"));
const StoreDetail = lazy(() => import("./layouts/store/Detail"));
const Expedition = lazy(() => import("./layouts/expedition/Index"));
const CreateExpedition = lazy(() => import("./layouts/expedition/Create"));
const DetailExpedition = lazy(() => import("./layouts/expedition/Detail"));
const Sales = lazy(() => import("./layouts/sales/Index"));
const CreateSales = lazy(() => import("./layouts/sales/Create"));
const DetailSales = lazy(() => import("./layouts/sales/detail/Index"));
const CustomerSalesDetail = lazy(
  () => import("./layouts/sales/detail/CustomerDetail")
);
const Distributor = lazy(() => import("./layouts/distributor/Index"));
const CreateDistributor = lazy(() => import("./layouts/distributor/Create"));
const DetailDistributor = lazy(
  () => import("./layouts/distributor/detail/Index")
);
const Order = lazy(() => import("./layouts/order/Index"));
const OrderWaiting = lazy(() => import("./layouts/order/waiting/Detail"));
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
        path: "produk/sub-kategori/:id",
        element: (
          <Suspense fallback={<Skeleton />}>
            <DetailSubCategory />
          </Suspense>
        ),
      },
      {
        path: "toko",
        element: (
          <Suspense fallback={<Skeleton />}>
            <Store />
          </Suspense>
        ),
      },
      {
        path: "toko/:id",
        element: (
          <Suspense fallback={<Skeleton />}>
            <StoreDetail />
          </Suspense>
        ),
      },
      {
        path: "ekspedisi",
        element: (
          <Suspense fallback={<Skeleton />}>
            <Expedition />
          </Suspense>
        ),
      },
      {
        path: "ekspedisi/tambah",
        element: (
          <Suspense fallback={<Skeleton />}>
            <CreateExpedition />
          </Suspense>
        ),
      },
      {
        path: "ekspedisi/:id",
        element: (
          <Suspense fallback={<Skeleton />}>
            <DetailExpedition />
          </Suspense>
        ),
      },
      {
        path: "sales",
        element: (
          <Suspense fallback={<Skeleton />}>
            <Sales />
          </Suspense>
        ),
      },
      {
        path: "sales/tambah",
        element: (
          <Suspense fallback={<Skeleton />}>
            <CreateSales />
          </Suspense>
        ),
      },
      {
        path: "sales/:id",
        element: (
          <Suspense fallback={<Skeleton />}>
            <DetailSales />
          </Suspense>
        ),
      },
      {
        path: "sales/:id/pelanggan/:id",
        element: (
          <Suspense fallback={<Skeleton />}>
            <CustomerSalesDetail />
          </Suspense>
        ),
      },
      {
        path: "distributor",
        element: (
          <Suspense fallback={<Skeleton />}>
            <Distributor />
          </Suspense>
        ),
      },
      {
        path: "distributor/tambah",
        element: (
          <Suspense fallback={<Skeleton />}>
            <CreateDistributor />
          </Suspense>
        ),
      },
      {
        path: "distributor/:id",
        element: (
          <Suspense fallback={<Skeleton />}>
            <DetailDistributor />
          </Suspense>
        ),
      },
      {
        path: "order",
        element: (
          <Suspense fallback={<Skeleton />}>
            <Order />
          </Suspense>
        ),
      },
      {
        path: "order/menunggu/:id",
        element: (
          <Suspense fallback={<Skeleton />}>
            <OrderWaiting />
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
