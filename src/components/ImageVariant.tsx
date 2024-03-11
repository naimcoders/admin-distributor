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

    const handleDeleteProductImage = () => {
      const mapping = props.variantTypes.map((type) => ({
        ...type,
        name: type.name,
        variantColorProduct: type.variantColorProduct,
        imageUrl: props.label === type.name ? "" : type.imageUrl,
      }));
      props.setVariantTypes(mapping);
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
