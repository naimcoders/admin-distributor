import React from "react";
import cx from "classnames";
import Image from "src/components/Image";
import mokes from "src/assets/images/mokes.png";
import Hamburger from "src/components/Hamburger";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "src/components/Button";
import {
  ArrowRightStartOnRectangleIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { useAuth } from "src/firebase/auth";
import { stringifyQuery } from "src/helpers";
import { useActiveModal } from "src/stores/modalStore";
import { CreateNewPin } from "src/components/Pin";

const Layout = () => {
  return (
    <main>
      <Header />
      <section className="bg-background">
        <AsideNav />
        <main className="p-6 lg:p-8 md:w-calcSideBar md:ml-56 relative overflow-auto h-calcOutlet">
          <Outlet />
        </main>
      </section>
      <CreateNewPin header={{ label: "buat PIN" }} />
    </main>
  );
};

const Header = () => {
  const { pathname } = useLocation();
  const [path, setPath] = React.useState("");
  const { actionIsCreatePin } = useActiveModal();

  React.useEffect(() => {
    setPath(pathname?.split("/")[1]);
  }, [pathname]);

  const currentPath = path.split("-").join(" ");

  return (
    <header className="px-6 py-3 lg:px-8 bg-primary flex gap-4 justify-between items-center sticky top-0 z-10">
      <section className="flex gap-6 items-center">
        <Hamburger />
        <Image src={mokes} alt="Mokes" width={65} />
      </section>

      <section className="flex gap-4">
        {currentPath === "dashboard" && (
          <PowerIcon
            width={20}
            color="#FFFFFF"
            title="Aktifkan akun"
            className="cursor-pointer"
            onClick={actionIsCreatePin}
          />
        )}
        <h1 className="text-secondary font-interMedium tracking-wide hidden md:block text-2xl capitalize">
          {currentPath}
        </h1>
      </section>
    </header>
  );
};

export const removeDashString = (data: string) => data.split("-").join(" ");

const AsideNav = () => {
  const qsProduct = stringifyQuery({ tab: "produk", page: 1 });
  const qsStore = stringifyQuery({ page: 1 });
  const qsDIstributor = stringifyQuery({ page: 1 });

  return (
    <aside className="md-max:hidden bg-secondary h-calcSideBar flex flex-col fixed w-56">
      <section className="overflow-y-auto flex flex-col">
        <Link name="Dashboard" path="dashboard" />
        <Link name="Banner" path="banner" />
        <Link name="Produk" path={`produk?${qsProduct}`} />
        <Link name="Toko" path={`toko?${qsStore}`} />
        <Link
          name="Sub Distributor"
          path={`sub-distributor?${qsDIstributor}`}
        />
        <Link name="Sales" path="sales" />
        <Link name="Ekspedisi" path="ekspedisi" />
        <Link name="Order" path="order" />
        <Link name="Report" path="report" />
        <Link name="Akun" path="akun" />
        <Logout />
      </section>
    </aside>
  );
};

const Link = ({ name, path }: { name: string; path: string }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive, isPending }) =>
        cx(
          "block px-6 lg:px-8 py-3 remove-highlight border-b border-gray-400 transition-colors",
          isPending && "bg-secondary",
          isActive && "bg-primary text-secondary border-t border-gray-500"
        )
      }
    >
      {name}
    </NavLink>
  );
};

export const arrNavigationLabels: { label: string }[] = [
  { label: "dashboard" },
  { label: "banner" },
  { label: "produk" },
  { label: "toko" },
  { label: "distributor" },
  { label: "sales" },
  { label: "ekspedisi" },
  { label: "order" },
  { label: "report" },
  { label: "akun" },
];

export const Logout = () => {
  const { logout } = useAuth();

  return (
    <div className="my-8 flex justify-center">
      <Button
        aria-label="Logout"
        className="bg-[#c41414]"
        endContent={
          <ArrowRightStartOnRectangleIcon width={18} color="#FFFFFF" />
        }
        onClick={logout}
      />
    </div>
  );
};

export const GridInput: React.FC<
  { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>
> = ({ children, className }) => {
  return (
    <section className={cx("grid-min-300 gap-x-8 gap-y-10", className)}>
      {children}
    </section>
  );
};

export default Layout;
