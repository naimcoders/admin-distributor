import folder from "src/assets/images/folder.png";
import cx from "classnames";
import { Image as Img } from "@nextui-org/react";
import { ImgHTMLAttributes, useState } from "react";
import { Radius } from "src/types";

export type IconImage = {
  src: React.ReactNode;
  onClick?: () => void;
};

type Image = Partial<HTMLImageElement> & {
  icons?: IconImage[];
  radius?: Radius;
};

export default function Image({
  src,
  alt,
  width,
  icons,
  loading,
  radius,
  className,
}: Image) {
  const [onHover, setOnHover] = useState(false);

  const mouseEnter = () => setOnHover(true);
  const mouseLeave = () => setOnHover(false);

  return (
    <section className="relative">
      <Img
        alt={alt}
        src={src}
        className={cx("z-0", className)}
        loading={loading}
        radius={radius && radius}
        width={!width ? 300 : width}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
      />

      {icons && (
        <div
          className={cx(
            "absolute right-2 top-2 cursor-pointer",
            !onHover ? "hidden" : "block"
          )}
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
}

export const ImageFolder: React.FC<
  {} & ImgHTMLAttributes<HTMLImageElement>
> = ({ className, src, alt, ...props }) => {
  return (
    <img
      src={folder}
      alt="folder"
      {...props}
      className={cx("w-6 h-4 cursor-pointer", className)}
    />
  );
};
