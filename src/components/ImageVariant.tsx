import React from "react";
import Image from "./Image";
import cx from "classnames";
import { ChildRef, FileProps } from "./File";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { IconColor } from "src/types";
import { UseVariantProps } from "src/layouts/product/Modals/Variant";

const VariantImage = React.forwardRef(
  (
    props: Partial<FileProps> & {
      label: string;
      image: string;
      onDeleteImage: (name: string, path?: string) => void;
      variantId?: string;
    } & UseVariantProps,
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
                  onClick: () => props.onDeleteImage(props.label, props.image),
                },
              ]}
            />
          )}
          <p
            className={cx(
              `text-sm text-[${IconColor.zinc}] text-center border border-gray-400 rounded-br-md rounded-bl-md py-1 truncate px-3`,
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
