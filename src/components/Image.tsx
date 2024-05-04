import folder from "src/assets/images/folder.png";
import cx from "classnames";
import { Image as Img } from "@nextui-org/react";
import { ImgHTMLAttributes, useState } from "react";
import { Radius } from "src/types";

export type IconImage = {
  src: React.ReactNode;
  onClick?: () => void;
};

type Image = Pick<
  Partial<HTMLImageElement>,
  "src" | "alt" | "width" | "loading" | "className"
> & {
  actions?: IconImage[];
  radius?: Radius;
  classNameWrapper?: string;
};

export default function Image({
  src,
  alt,
  width,
  actions,
  loading,
  radius,
  className,
  classNameWrapper,
}: Image) {
  const [onHover, setOnHover] = useState(false);
  const mouseEnter = () => setOnHover(true);
  const mouseLeave = () => setOnHover(false);

  return (
    <section className={cx("relative", classNameWrapper)}>
      <Img
        alt={alt}
        src={src}
        width={width}
        loading={loading}
        radius={radius ?? "sm"}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        className={cx("z-0", className)}
      />

      {actions && (
        <div
          className={cx(
            "absolute top-2 left-2 cursor-pointer",
            !onHover ? "hidden" : "block"
          )}
          onMouseEnter={mouseEnter}
        >
          {actions.map((icon, idx) => (
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
