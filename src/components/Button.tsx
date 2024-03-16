import cx from "classnames";
import { Button as Btn } from "@nextui-org/react";
import { HTMLAttributes } from "react";
import { Color, Radius, Size } from "src/types";

type PickButton = Pick<
  HTMLAttributes<HTMLButtonElement>,
  "aria-label" | "className" | "onClick"
>;

interface Button extends PickButton {
  color: Color;
  radius: Radius;
  size: Size;
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
  disabled?: boolean;
}

export const Button = ({
  className,
  color,
  endContent,
  startContent,
  onClick,
  radius,
  size,
  "aria-label": label,
  variant,
  disabled,
}: Partial<Button>) => {
  return (
    <Btn
      onClick={onClick}
      endContent={endContent}
      startContent={startContent}
      color={!color ? "primary" : color}
      className={cx("capitalize w-36", className)}
      radius={!radius ? "sm" : radius}
      variant={variant}
      size={size ?? "md"}
      disabled={disabled}
    >
      {label}
    </Btn>
  );
};
