import cx from "classnames";
import Hamburger from "src/components/Hamburger";
import logoWithTitle from "src/assets/images/Pilipilih_flat_white.png";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "src/components/Button";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";

const Layout = () => {
  return (
    <main>
      <Header />
      <section className="bg-background">
        <AsideNav />
        <main className="p-6 lg:p-8 md:w-calcSideBar md:ml-56 relative flex flex-col gap-6">
          <Outlet />
        </main>
      </section>
    </main>
  );
};

const Header = () => {
  const { pathname } = useLocation();
  const [path, setPath] = useState("");

  useEffect(() => {
    setPath(pathname?.split("/")[1]);
  }, [pathname]);

  return (
    <header className="px-6 py-7 lg:px-8 bg-primary flex gap-4 justify-between items-center sticky top-0 z-10">
      <section className="flex gap-6 items-center">
        <Hamburger />
        <img
          src={logoWithTitle}
          alt="PiliPilih Logo"
          className="w-28 sm:w-32 md:w-36"
        />
      </section>
      <h1 className="text-secondary font-interMedium tracking-wide hidden md:block text-xl capitalize">
        {path.split("-").join(" ")}
      </h1>
    </header>
  );
};

export const removeDashString = (data: string) => data.split("-").join(" ");

const AsideNav = () => {
  return (
    <aside className="md-max:hidden bg-secondary h-calcSideBar flex flex-col fixed w-56">
      <section className="overflow-y-auto flex flex-col">
        {arrNavigationLabels.map((el) => (
          <NavLink
            key={el.label}
            to={el.label}
            className={({ isActive, isPending }) =>
              cx(
                "block px-6 lg:px-8 py-3 remove-highlight capitalize border-b border-gray-400 transition-colors",
                isPending && "bg-secondary",
                isActive && "bg-primary text-secondary border-t border-gray-500"
              )
            }
          >
            {removeDashString(el.label)}
          </NavLink>
        ))}
        <Logout />
      </section>
    </aside>
  );
};

export const arrNavigationLabels: { label: string }[] = [
  { label: "dashboard" },
  { label: "banner" },
  { label: "produk" },
  { label: "toko" },
  { label: "order" },
  { label: "akun" },
];

export const Logout = () => {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <Button
        aria-label="Logout"
        color="danger"
        endContent={
          <ArrowRightStartOnRectangleIcon width={18} color="#FFFFFF" />
        }
      />
    </div>
  );
};

export default Layout;
