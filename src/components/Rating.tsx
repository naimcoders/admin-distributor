import cx from "classnames";
import { StarIcon } from "@heroicons/react/24/solid";
import { Chip } from "@nextui-org/react";
import { HTMLAttributes } from "react";

const Rating = (
  props: { value?: number | string } & HTMLAttributes<HTMLDivElement>
) => {
  return (
    <div className={cx("flex", props.className)}>
      <Chip
        startContent={<StarIcon color="#cbde23" width={18} />}
        color="default"
        variant="bordered"
        className={"font-interBold text-xs"}
      >
        {props.value}
      </Chip>
    </div>
  );
};

export default Rating;
