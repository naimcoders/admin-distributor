import cx from "classnames";
import folder from "src/assets/images/folder.png";
import { Switch } from "@nextui-org/react";
import { HTMLAttributes, ImgHTMLAttributes } from "react";

interface Switch {
  isSelected?: boolean;
  onClick?: () => void;
}

interface ActionProps {
  id: number | string;
  action?: "switch" | "detail" | "switch-detail";
  switch?: Switch;
  detail?: HTMLAttributes<HTMLImageElement>;
  render?: React.ReactNode;
}

export const Actions: React.FC<ActionProps> = (props) => {
  return (
    <section
      className={cx(
        "flex justify-center lg:gap-4 gap-3 items-center",
        props.action === "switch-detail" && "px-3"
      )}
    >
      {props.action === "switch-detail" && (
        <>
          <Switch
            as="button"
            aria-label="action"
            color="success"
            onClick={props.switch?.onClick}
            isSelected={props.switch?.isSelected}
            className="outline-none"
            id={String(props.id)}
            name={String(props.id)}
            aria-labelledby={String(props.id)}
            size="sm"
            classNames={{ base: "z-0" }}
          />

          <FolderIcon
            onClick={props.detail?.onClick}
            className={props.detail?.className}
          />
        </>
      )}

      {props.action === "switch" && (
        <Switch
          aria-label="action"
          color="success"
          onClick={props.switch?.onClick}
          isSelected={props.switch?.isSelected}
          className="outline-none"
          id={String(props.id)}
          name={String(props.id)}
          aria-labelledby={String(props.id)}
        />
      )}

      {props.action === "detail" && (
        <FolderIcon
          onClick={props.detail?.onClick}
          className={props.detail?.className}
        />
      )}

      {props.render}
    </section>
  );
};

export const FolderIcon: React.FC<ImgHTMLAttributes<HTMLImageElement>> = ({
  className,
  ...props
}) => {
  return (
    <img
      src={folder}
      alt="Detail"
      className={cx("w-[25px] h-[17px] cursor-pointer", className)}
      {...props}
    />
  );
};
