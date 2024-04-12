import React from "react";
import cx from "classnames";
import Image from "src/components/Image";
import mokes from "src/assets/images/mokes.png";
import Hamburger from "src/components/Hamburger";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "src/components/Button";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { useAuth } from "src/firebase/auth";
import { stringifyQuery } from "src/helpers";
import { useActiveModal } from "src/stores/modalStore";
// import { CreateNewPin } from "src/components/Pin";
import { setUser } from "src/stores/auth";
import { RoleDistributor } from "src/api/distributor.service";
import { KeyIcon } from "@heroicons/react/24/outline";
import Skeleton from "src/components/Skeleton";

const Layout = () => {
  const user = setUser((v) => v.user);

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
          <main className="p-6 lg:p-8 md:w-calcSideBar md:ml-56 relative overflow-auto h-calcOutlet">
            <Outlet />
          </main>
        </section>
      )}

      {/* <CreateNewPin header={{ label: "buat PIN" }} /> */}
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
          <KeyIcon
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
      <LinkSideBar name="Order" path="order" />
      {user?.role === RoleDistributor.DISTRIBUTOR && (
        <LinkSideBar name="Report" path="report" />
      )}
      <LinkSideBar name="Akun" path="akun" />

      <Button
        aria-label="Logout"
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
