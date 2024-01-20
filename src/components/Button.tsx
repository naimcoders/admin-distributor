import cx from "classnames";
import { Button as Btn } from "@nextui-org/react";
import { HTMLAttributes } from "react";
import { Color, Radius } from "src/types";

interface Button
  extends Pick<
    HTMLAttributes<HTMLButtonElement>,
    "aria-label" | "className" | "onClick"
  > {
  color: Color;
  startContent: React.ReactNode;
  endContent: React.ReactNode;
  radius: Radius;
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
    >
      {props["aria-label"]}
    </Btn>
  );
};
