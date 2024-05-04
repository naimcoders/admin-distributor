import folder from "src/assets/images/folder.png";
import { Switch } from "@nextui-org/react";
import cx from "classnames";
import { HTMLAttributes, ImgHTMLAttributes } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { IconColor } from "src/types";

interface Switch {
  isSelected?: boolean;
  onClick?: () => void;
}

interface ActionProps {
  id: number | string;
  action: "switch" | "detail" | "switchAndDetail" | "deleteAndDetail";
  switch?: Switch;
  detail?: HTMLAttributes<HTMLImageElement>;
  delete?: () => void;
}

export const Actions: React.FC<ActionProps> = (props) => {
  return (
    <section
      className={cx(
        "flex justify-center lg:gap-4 gap-3 items-center",
        props.action === "switchAndDetail" && "px-3"
      )}
    >
      {props.action === "switchAndDetail" && (
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

      {props.action === "deleteAndDetail" && (
        <>
          <TrashIcon
            width={20}
            color={IconColor.red}
            onClick={props.delete}
            className="cursor-pointer"
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
