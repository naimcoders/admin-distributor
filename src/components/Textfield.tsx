import cx from "classnames";
import { Input } from "@nextui-org/react";
import { HTMLAttributes, KeyboardEvent, ReactNode, Ref } from "react";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { ChildRef, FileProps } from "./File";
import { Radius } from "src/types";
import { IconImage } from "./Image";
import { NumericFormat } from "react-number-format";

interface ReadOnlyProps {
  isValue: boolean;
  cursor?: "cursor-text" | "cursor-pointer" | "cursor-default";
}

interface UploadImageProps {
  file: Pick<FileProps, "onChange" | "onClick"> & {
    ref: Ref<ChildRef>;
  };
  image: {
    actions: IconImage[];
  };
}

export interface TextfieldProps<S extends FieldValues>
  extends UseControllerProps<S>,
    Pick<HTMLAttributes<HTMLInputElement>, "className"> {
  type?: string;
  label?: string;
  radius?: Radius;
  placeholder?: string;
  description?: string;
  onClick?: () => void;
  errorMessage?: string;
  endContent?: ReactNode;
  classNameWrapper?: string;
  startContent?: ReactNode;
  readOnly?: ReadOnlyProps;
  autoComplete?: "on" | "off";
  uploadImage?: UploadImageProps;
  classNames?: {
    input: string;
  };
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}
export const Textfield = <T extends object>(props: TextfieldProps<T>) => {
  const { field } = useController(props);

  return (
    <section className={cx("flexcol gap-4", props.classNameWrapper)}>
      {props.label && <h2 className="text-sm capitalize">{props.label}</h2>}
      <Input
        {...field}
        type={props.type}
        onKeyDown={props.onKeyDown}
        labelPlacement="outside"
        onClick={props.onClick}
        placeholder={props.placeholder}
        errorMessage={props.errorMessage}
        description={props.description}
        startContent={props.startContent}
        isReadOnly={props.readOnly?.isValue}
        radius={!props.radius ? "sm" : props.radius}
        className={cx("w-full", props.className)}
        color={props.errorMessage ? "danger" : "default"}
        autoComplete={props.autoComplete ?? "off"}
        classNames={{
          base: "z-0",
          errorMessage: "capitalize font-interMedium",
          description: "text-[#71717A] first-letter:capitalize",
          input: cx(
            "placeholder:capitalize",
            props.classNames?.input,
            props.readOnly?.cursor
          ),
        }}
        title={props.defaultValue}
        endContent={props.endContent}
      />
    </section>
  );
};

export const TextfieldCurrency = <T extends object>(
  props: TextfieldProps<T>
) => {
  const { field } = useController(props);

  return (
    <section className={cx("flexcol gap-4", props.classNameWrapper)}>
      {props.label && <h2 className="text-sm capitalize">{props.label}</h2>}
      <NumericFormat
        {...field}
        onKeyDown={props.onKeyDown}
        onClick={props.onClick}
        placeholder={props.placeholder}
        readOnly={props.readOnly?.isValue}
        className={cx(
          "w-full rounded-md  p-[0.50rem] capitalize text-sm",
          props.className
        )}
        color={props.errorMessage ? "danger" : "default"}
        autoComplete={props.autoComplete ?? "off"}
        prefix="Rp."
        thousandSeparator={true}
        title={props.defaultValue}
      />
      {props.errorMessage && (
        <p className="text-red-500 text-xs my-3">{props.errorMessage}</p>
      )}
    </section>
  );
};

export const objectFields = <T extends object>({
  autoComplete,
  placeholder,
  errorMessage,
  ...props
}: TextfieldProps<T>): TextfieldProps<T> => {
  const obj = {
    autoComplete: autoComplete ? autoComplete : "off",
    placeholder: placeholder
      ? placeholder
      : `Masukkan ${props.label?.replace("*", "")}`,
    errorMessage: errorMessage
      ? errorMessage
      : `Masukkan ${props.label?.replace("*", "")}`,
    ...props,
  } satisfies TextfieldProps<T>;

  return obj;
};
