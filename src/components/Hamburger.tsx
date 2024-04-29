import mokes from "src/assets/images/mokes.png";
import cx from "classnames";
import { SideBarFeature } from "src/layouts/Index";
import { useState } from "react";
import Drawer from "react-modern-drawer";
import Image from "./Image";

const Hamburger = () => {
  const { setIsOpen, styleTop, styleBottom, styleMiddle, isOpen } =
    useHamburger();

  return (
    <section className="md:hidden">
      <section
        className="flex flex-col gap-1 cursor-pointer remove-highlight w-max"
        onClick={() => setIsOpen((v) => !v)}
      >
        <div className={styleTop}></div>
        <div className={styleMiddle}></div>
        <div className={styleBottom}></div>
      </section>

      <Drawer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        direction="left"
        lockBackgroundScroll
      >
        <div className="bg-primary px-5 py-6">
          <Image src={mokes} alt="Mokes" width={70} />
        </div>
        <section className="mt-1 overflow-y-auto flex flex-col h-calcSideBarDrawer">
          <SideBarFeature onClickNav={() => setIsOpen(false)} />
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

  return {
    setIsOpen,
    styleTop,
    styleBottom,
    styleMiddle,
    isOpen,
  };
}

export default Hamburger;
