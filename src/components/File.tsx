import cx from "classnames";
import { UseForm } from "src/types";
import { Textfield, TextfieldProps } from "./Textfield";
import {
  FC,
  forwardRef,
  HTMLAttributes,
  Ref,
  useImperativeHandle,
  useRef,
} from "react";
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
  (props: FileProps & TextfieldProps<any>, ref: Ref<ChildRef>) => {
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

interface IImageFile extends HTMLAttributes<HTMLInputElement> {
  render: React.ReactNode;
}

export const ImageFile = forwardRef((props: IImageFile, ref: Ref<ChildRef>) => {
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
      {props.render}
    </>
  );
});

interface LabelAndImageProps
  extends Pick<HTMLAttributes<HTMLImageElement>, "className"> {
  src: string;
  label?: string;
  actions?: IconImage[];
  onClick?: () => void;
}

export const LabelAndImage: FC<LabelAndImageProps> = (props) => {
  return (
    <section className="flex flex-col gap-4">
      {props.label && <h2 className="text-sm capitalize">{props.label}</h2>}
      <Image
        src={props.src}
        alt="image"
        loading="lazy"
        actions={props.actions}
        className={cx("aspect-video object-cover", props.className)}
        onClick={props.onClick}
      />
    </section>
  );
};
