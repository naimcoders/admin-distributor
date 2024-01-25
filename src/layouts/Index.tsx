import cx from "classnames";
import mokes from "src/assets/images/mokes.png";
import Hamburger from "src/components/Hamburger";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "src/components/Button";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import Image from "src/components/Image";

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
    <header className="px-6 py-2 lg:px-8 bg-primary flex gap-4 justify-between items-center sticky top-0 z-10">
      <section className="flex gap-6 items-center">
        <Hamburger />
        <Image src={mokes} alt="Mokes" width={70} />
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
  { label: "distributor" },
  { label: "sales" },
  { label: "ekspedisi" },
  { label: "order" },
  { label: "report" },
  { label: "akun" },
];

export const Logout = () => {
  return (
    <div className="my-8 flex justify-center">
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
