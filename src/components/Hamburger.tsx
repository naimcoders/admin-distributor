import logoWithTitle from "src/assets/images/Pilipilih_flat_white.png";
import cx from "classnames";
import { NavLink } from "react-router-dom";
import {
  Logout,
  arrNavigationLabels,
  removeDashString,
} from "src/layouts/Index";
import { useState } from "react";
import Drawer from "react-modern-drawer";

const Hamburger = () => {
  const { handleBurger, styleTop, styleBottom, styleMiddle, isOpen } =
    useHamburger();

  return (
    <section className="md:hidden">
      <section
        className="flex flex-col gap-1 cursor-pointer remove-highlight w-max"
        onClick={handleBurger}
      >
        <div className={styleTop}></div>
        <div className={styleMiddle}></div>
        <div className={styleBottom}></div>
      </section>

      <Drawer
        open={isOpen}
        onClose={handleBurger}
        direction="left"
        lockBackgroundScroll
      >
        <div className="bg-primary px-5 py-4">
          <img src={logoWithTitle} alt="PiliPilih Logo" className="w-[70%]" />
        </div>
        <section className="mt-1 overflow-y-auto flex flex-col gap-1 h-calcSideBar">
          {arrNavigationLabels.map((el) => (
            <NavLink
              to={el.label}
              className={({ isActive, isPending }) =>
                cx(
                  "utline-none px-6 lg:px-8 py-3 remove-highlight capitalize flex border-b border-gray-400 transition-colors",
                  isPending && "bg-secondary",
                  isActive &&
                    "bg-primary text-secondary border-t border-gray-500"
                )
              }
              key={el.label}
              onClick={handleBurger}
            >
              {removeDashString(el.label)}
            </NavLink>
          ))}

          <Logout />
        </section>
      </Drawer>
    </section>
  );
};

export function useHamburger() {
  const [isOpen, setIsOpen] = useState(false);
  const staticStyle = "w-6 h-[.15rem] sm:h-1 sm:w-8 bg-white rounded-md";

  const styleTop = cx(
    staticStyle,
    isOpen
      ? "rotate-45 translate-y-2 transition-transform"
      : "transition-transform"
  );
  const styleMiddle = cx(
    staticStyle,
    isOpen ? "scale-0 transition-transform" : "scale-100 transition-transform"
  );
  const styleBottom = cx(
    staticStyle,
    isOpen
      ? "-rotate-45 -translate-y-2 transition-transform"
      : "transition-transform"
  );

  const handleBurger = () => setIsOpen(!isOpen);
  return {
    handleBurger,
    styleTop,
    styleBottom,
    styleMiddle,
    isOpen,
  };
}

export default Hamburger;
