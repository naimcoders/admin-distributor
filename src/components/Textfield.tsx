import cx from "classnames";
import { Input } from "@nextui-org/react";
import { HTMLAttributes, Ref } from "react";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { ChildRef, FileProps } from "./File";

interface Textfield
  extends UseControllerProps<FieldValues>,
    Pick<HTMLAttributes<HTMLInputElement>, "className"> {
  type?: string;
  label?: string;
  placeholder?: string;
  onClick?: () => void;
  errorMessage?: string;
  autoComplete?: "on" | "off";
  endContent?: React.ReactNode;
  startContent?: React.ReactNode;
  readOnly?: {
    isValue: boolean;
    cursor?: "cursor-text" | "cursor-pointer" | "cursor-default";
  };
}

export const Textfield = (props: Textfield) => {
  const { field } = useController(props);
  return (
    <Input
      {...field}
      radius="sm"
      type={props.type}
      label={props.label}
      labelPlacement="outside"
      onClick={props.onClick}
      className={props.className}
      endContent={props.endContent}
      placeholder={props.placeholder}
      errorMessage={props.errorMessage}
      autoComplete={props.autoComplete}
      startContent={props.startContent}
      isReadOnly={props.readOnly?.isValue}
      color={props.errorMessage ? "danger" : "default"}
      classNames={{
        input: cx("placeholder:capitalize", props.readOnly?.cursor),
        errorMessage: "capitalize font-interMedium",
        label: "font-interMedium capitalize",
        base: "z-0",
      }}
      title={props.defaultValue}
    />
  );
};

export interface GeneralFields
  extends Pick<
    Textfield,
    "label" | "placeholder" | "type" | "autoComplete" | "className" | "readOnly"
  > {
  name: string;
  errorMessage: string;
  defaultValue: string | number;
  forField: string;
  refs: Required<
    Pick<FileProps, "onChange" | "onClick"> & { ref: Ref<ChildRef> }
  >;
  deleteImage: () => void;
}

export type PartialGeneralFields = Partial<GeneralFields>;

export const objectFields = (
  props: PartialGeneralFields
): PartialGeneralFields => {
  const obj = {
    type: props.type,
    name: props.name,
    label: props.label,
    className: props.className,
    forField: props.forField,
    defaultValue: props.defaultValue,
    refs: props.refs,
    deleteImage: props.deleteImage,
    placeholder: props.placeholder
      ? props.placeholder
      : `Masukkan ${props.label}`,
    errorMessage: props.errorMessage
      ? props.errorMessage
      : `Masukkan ${props.label}`,
    readOnly: {
      isValue: props.readOnly?.isValue!,
      cursor: props.readOnly?.cursor,
    },
    autoComplete: props.autoComplete ? props.autoComplete : "off",
  } satisfies PartialGeneralFields;

  return obj;
};
