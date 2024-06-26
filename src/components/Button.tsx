import cx from "classnames";
import { Button as Btn } from "@nextui-org/react";
import { Color, Radius, Size } from "src/types";

type PickButton = Pick<
  React.HTMLAttributes<HTMLButtonElement>,
  "className" | "onClick"
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
  label: string | React.ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
}

export const Button = ({
  className,
  color,
  endContent,
  startContent,
  onClick,
  radius,
  size,
  variant,
  disabled,
  isLoading,
  label,
}: Partial<Button>) => {
  return (
    <Btn
      onClick={onClick}
      endContent={endContent}
      startContent={startContent}
      color={!color ? "primary" : color}
      className={cx("capitalize min-w-36", className)}
      radius={!radius ? "sm" : radius}
      variant={variant}
      size={size ?? "md"}
      disabled={disabled}
      isLoading={isLoading}
    >
      {label}
    </Btn>
  );
};
