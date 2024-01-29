import cx from "classnames";
import { HTMLAttributes } from "react";

interface LabelProps extends HTMLAttributes<HTMLDivElement> {
  label: string | number;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

const Label: React.FC<LabelProps> = (props) => {
  return (
    <p className={cx("flex gap-2", props.className)}>
      {props.endContent}
      {props.label}
      {props.startContent}
    </p>
  );
};

export default Label;
