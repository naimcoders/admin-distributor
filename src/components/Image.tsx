import cx from "classnames";
import { Image as Img } from "@nextui-org/react";
import { useState } from "react";

export type IconImage = {
  src: React.ReactNode;
  onClick?: () => void;
};

type Image = Partial<HTMLImageElement> & {
  icons?: IconImage[];
};

const Image = ({ src, alt, width, icons, loading }: Image) => {
  const [onHover, setOnHover] = useState(false);

  const mouseEnter = () => setOnHover(true);
  const mouseLeave = () => setOnHover(false);

  return (
    <section className="relative">
      <Img
        alt={alt}
        src={src}
        className="z-0"
        loading={loading}
        width={!width ? 300 : width}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
      />

      {!icons ? null : (
        <div
          className={cx(
            "absolute right-2 top-2 cursor-pointer",
            !onHover ? "hidden" : "block"
          )}
          title="Delete"
          onMouseEnter={mouseEnter}
        >
          {icons.map((icon, idx) => (
            <div
              className="bg-white p-1 rounded-full mb-2"
              onClick={icon.onClick}
              key={idx}
            >
              {icon.src}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Image;
