import React from "react";
import cx from "classnames";
import Image from "src/components/Image";
import Hamburger from "src/components/Hamburger";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "src/components/Button";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { useAuth } from "src/firebase/auth";
import { splitSlash, stringifyQuery } from "src/helpers";
import { setUser } from "src/stores/auth";
import { RoleDistributor } from "src/api/distributor.service";
import Skeleton from "src/components/Skeleton";

const setFavicon = (faviconUrl: string) => {
  const favicon = document.querySelector('link[rel="shortcut icon"]');
  if (favicon instanceof HTMLLinkElement) {
    favicon.href = faviconUrl;
  }
};

const Layout = () => {
  const user = setUser((v) => v.user);

  React.useEffect(() => {
    if (user) setFavicon(user.imageUrl);
  }, [user]);

  return (
    <main>
      <Header />
      {!user ? (
        <div className="p-5">
          <Skeleton />
        </div>
      ) : (
        <section className="bg-background">
          <AsideNav />
          <main
            className={cx(
              "p-6 lg:pt-6 lg:pb-3 md:w-calcSideBar md:ml-56 relative overflow-auto h-calcOutlet"
            )}
          >
            <Outlet />
          </main>
        </section>
      )}
    </main>
  );
};

const Header = () => {
  const { pathname } = useLocation();
  const [path, setPath] = React.useState("");
  const user = setUser((v) => v.user);

  React.useEffect(() => {
    setPath(splitSlash(pathname));
  }, [pathname]);

  const currentPath = path.split("-").join(" ");

  return (
    <header className="px-6 py-3 lg:px-8 bg-primary flex gap-4 justify-between items-center sticky top-0 z-10">
      <section className="flex gap-6 items-center">
        <Hamburger />
        {user && (
          <Image
            src={user.imageUrl}
            alt="Logo"
            width={65}
            loading="lazy"
            className="rounded-full aspect-square object-cover "
          />
        )}
      </section>

      <section className="flex gap-4">
        <h1 className="text-secondary font-medium tracking-wide hidden md:block text-2xl capitalize">
          {currentPath}
        </h1>
      </section>
    </header>
  );
};

export const removeDashString = (data: string) => data.split("-").join(" ");

const AsideNav = () => {
  return (
    <aside className="md-max:hidden bg-white h-full flex flex-col fixed w-56">
      <section className="overflow-y-auto flex flex-col">
        <SideBarFeature />
      </section>
    </aside>
  );
};

export const SideBarFeature = () => {
  const { logout } = useAuth();
  const user = setUser((v) => v.user);
  const qsProduct = stringifyQuery({ tab: "produk", page: 1 });
  const qsStore = stringifyQuery({ page: 1 });
  const qsDIstributor = stringifyQuery({ page: 1 });
  const qsOrder = stringifyQuery({ status: "waiting_accept" });

  return (
    <>
      <LinkSideBar name="Dashboard" path="dashboard" />
      <LinkSideBar name="Banner" path="banner" />
      <LinkSideBar name="Produk" path={`produk?${qsProduct}`} />
      <LinkSideBar name="Toko" path={`toko?${qsStore}`} />
      {user?.role === RoleDistributor.DISTRIBUTOR && (
        <>
          <LinkSideBar
            name="Sub Distributor"
            path={`sub-distributor?${qsDIstributor}`}
          />
          <LinkSideBar name="Sales" path="sales" />
          <LinkSideBar name="Ekspedisi" path="ekspedisi" />
        </>
      )}
      <LinkSideBar name="Order" path={`order?${qsOrder}`} />
      {user?.role === RoleDistributor.DISTRIBUTOR && (
        <LinkSideBar name="Report" path="report" />
      )}
      <LinkSideBar name="Akun" path="akun" />

      <Button
        label="Logout"
        className="bg-[#c41414] mx-auto mt-4"
        endContent={
          <ArrowRightStartOnRectangleIcon width={18} color="#FFFFFF" />
        }
        onClick={logout}
      />
    </>
  );
};

export const LinkSideBar = ({ name, path }: { name: string; path: string }) => {
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
