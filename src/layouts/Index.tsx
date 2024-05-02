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
              "p-6 lg:pt-6 lg:pb-3 md:w-calcSideBar md:ml-56 relative min-h-calcOutlet"
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
    <header className="px-6 py-2 lg:px-8 bg-primary flex gap-4 justify-between items-center sticky top-0 z-10">
      <section className="flex gap-6 items-center">
        <Hamburger />
        {user && (
          <Image
            src={user.imageUrl}
            alt="Logo"
            width={65}
            loading="lazy"
            className={cx(
              "rounded-full aspect-square object-cover hidden md:block"
            )}
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

export const SideBarFeature = ({ onClickNav }: { onClickNav?: () => void }) => {
  const { logout } = useAuth();
  const user = setUser((v) => v.user);
  const qsProduct = stringifyQuery({ tab: "produk", page: 1 });
  const qsStore = stringifyQuery({ page: 1 });
  const qsDIstributor = stringifyQuery({ page: 1 });
  const qsOrder = stringifyQuery({ status: "waiting_accept" });

  return (
    <>
      <LinkSideBar name="Dashboard" path="dashboard" onClickNav={onClickNav} />
      <LinkSideBar name="Banner" path="banner" onClickNav={onClickNav} />
      <LinkSideBar
        name="Produk"
        path={`produk?${qsProduct}`}
        onClickNav={onClickNav}
      />
      <LinkSideBar
        name="Toko"
        path={`toko?${qsStore}`}
        onClickNav={onClickNav}
      />
      {user?.role === RoleDistributor.DISTRIBUTOR && (
        <>
          <LinkSideBar
            onClickNav={onClickNav}
            name="Sub Distributor"
            path={`sub-distributor?${qsDIstributor}`}
          />
          <LinkSideBar name="Sales" path="sales" onClickNav={onClickNav} />
          <LinkSideBar
            name="Ekspedisi"
            path="ekspedisi"
            onClickNav={onClickNav}
          />
        </>
      )}
      <LinkSideBar
        name="Order"
        path={`order?${qsOrder}`}
        onClickNav={onClickNav}
      />
      {user?.role === RoleDistributor.DISTRIBUTOR && (
        <LinkSideBar name="Report" path="report" onClickNav={onClickNav} />
      )}
      <LinkSideBar name="Akun" path="akun" onClickNav={onClickNav} />

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

export const LinkSideBar = ({
  name,
  path,
  onClickNav,
}: {
  name: string;
  path: string;
  onClickNav?: () => void;
}) => {
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
      onClick={onClickNav}
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
