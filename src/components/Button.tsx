import cx from "classnames";
import { Button as Btn } from "@nextui-org/react";
import { HTMLAttributes } from "react";
import { Color, Radius } from "src/types";

type PickButton = Pick<
  HTMLAttributes<HTMLButtonElement>,
  "aria-label" | "className" | "onClick"
>;

interface Button extends PickButton {
  color: Color;
  radius: Radius;
  startContent: React.ReactNode;
  endContent: React.ReactNode;
  variant:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
}

export const Button = (props: Partial<Button>) => {
  const { className, color, endContent, startContent, onClick, radius } = props;

  return (
    <Btn
      onClick={onClick}
      endContent={endContent}
      startContent={startContent}
      color={!color ? "primary" : color}
      className={cx("capitalize", className)}
      radius={!radius ? "sm" : radius}
      variant={props.variant}
    >
      {props["aria-label"]}
    </Btn>
  );
};
