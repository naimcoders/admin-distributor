import { UseForm } from "src/types";
import { Textfield, TextfieldProps } from "./Textfield";
import { forwardRef, Ref, useImperativeHandle, useRef } from "react";
import Image from "./Image";

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

export const LabelAndImage = (props: { label: string; src: string }) => {
  return (
    <div className="flexcol gap-4">
      <h2 className="text-sm capitalize">{props.label}</h2>
      <Image
        src={props.src}
        alt="image"
        className="aspect-video object-cover"
      />
    </div>
  );
};
