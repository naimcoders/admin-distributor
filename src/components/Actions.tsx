import folder from "src/assets/images/folder.png";
import { Switch } from "@nextui-org/react";
import cx from "classnames";
import { HTMLAttributes, ImgHTMLAttributes } from "react";

type Switch = HTMLAttributes<HTMLInputElement> & {
  isSelected?: boolean;
};

interface ActionProps {
  id: number;
  action: "switch" | "detail" | "both";
  switch?: Switch;
  detail?: HTMLAttributes<HTMLImageElement>;
}

export const Actions: React.FC<ActionProps> = (props) => {
  return (
    <section className="flex justify-center gap-3 items-center px-3">
      {props.action === "both" && (
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
          />

          <FolderIcon onClick={props.detail?.onClick} />
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
        <FolderIcon onClick={props.detail?.onClick} />
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
      alt="Folder Icon"
      className={cx("w-6 h-4 cursor-pointer", className)}
      {...props}
    />
  );
};
