import cx from "classnames";
import { StarIcon } from "@heroicons/react/24/solid";
import { HTMLAttributes } from "react";
import Label from "./Label";

const Rating = (
  props: { rate?: number | string } & Pick<
    HTMLAttributes<HTMLDivElement>,
    "className"
  >
) => {
  return (
    <div className={cx("flex", props.className)}>
      <div className="flex gap-1 justify-center p-0">
        <StarIcon color="#cbde23" width={16} />
        <Label label={String(props.rate)} />
      </div>
    </div>
  );
};

export default Rating;
