import React from "react";
import Image from "./Image";
import cx from "classnames";
import { ChildRef, FileProps } from "./File";
import useGeneralStore, { VariantTypeProps } from "src/stores/generalStore";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { IconColor } from "src/types";

const VariantImage = React.forwardRef(
  (
    props: Partial<FileProps> & { label: string; image: string },
    ref: React.Ref<ChildRef>
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => ({
      click: () => {
        if (inputRef.current) {
          inputRef.current.click();
        }
      },
    }));

    const variantTypes = useGeneralStore((v) => v.variantTypes);
    const setVariantTypes = useGeneralStore((v) => v.setVariantType);

    const handleDeleteProductImage = () => {
      const [byLabel] = variantTypes.filter((f) => f.name === props.label);
      byLabel.imageUrl = "";
      const currentValues: VariantTypeProps[] = [];
      variantTypes.forEach((e) => {
        if (e.name === props.label) currentValues.push(byLabel);
        if (e.name !== props.label) currentValues.push(e);
      });
      setVariantTypes(currentValues);
    };

    return (
      <>
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={props.onChange}
        />

        <section
          className={cx(!props.image ? "cursor-pointer" : "cursor-default")}
          onClick={!props.image ? props.onClick : undefined}
        >
          {!props.image ? (
            <section className="flex gap-2 border aspect-square border-dashed border-gray-400 p-2 rounded-tl-md rounded-tr-md items-center">
              <PlusIcon width={16} color={IconColor.zinc} />
              <p className={`capitalize text-sm text-[${IconColor.zinc}]`}>
                tambah foto/video
              </p>
            </section>
          ) : (
            <Image
              radius="none"
              src={props.image}
              className="rounded-tl-md rounded-tr-md aspect-square object-cover border border-gray-400"
              actions={[
                {
                  src: <TrashIcon width={16} color={IconColor.red} />,
                  onClick: handleDeleteProductImage,
                },
              ]}
            />
          )}
          <p
            className={cx(
              `text-sm text-[${IconColor.zinc}] text-center border border-gray-400 rounded-br-md rounded-bl-md py-1`,
              !props.image ? "border-dashed" : "border-solid"
            )}
          >
            {props.label}
          </p>
        </section>
      </>
    );
  }
);

export default VariantImage;
