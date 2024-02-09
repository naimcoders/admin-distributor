import { UseForm } from "src/types";
import { Textfield, TextfieldProps } from "./Textfield";
import { FC, forwardRef, Ref, useImperativeHandle, useRef } from "react";
import Image, { IconImage } from "./Image";

export interface FileProps extends Pick<UseForm, "control"> {
  onClick?: () => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  startContent?: React.ReactNode;
}

export interface ChildRef {
  click: () => void;
}

export const File = forwardRef(
  (props: FileProps & TextfieldProps, ref: Ref<ChildRef>) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
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

        <Textfield
          readOnly={{ isValue: true, cursor: "cursor-pointer" }}
          {...props}
        />
      </>
    );
  }
);

interface LabelAndImageProps {
  src: string;
  label?: string;
  actions?: IconImage[];
}

export const LabelAndImage: FC<LabelAndImageProps> = ({
  label,
  src,
  actions,
}) => {
  return (
    <section className="flexcol gap-4">
      {label && <h2 className="text-sm capitalize">{label}</h2>}
      <Image
        src={src}
        alt="image"
        actions={actions}
        className="aspect-video object-cover"
      />
    </section>
  );
};
