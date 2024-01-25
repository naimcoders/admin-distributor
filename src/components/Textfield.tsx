import cx from "classnames";
import { Input } from "@nextui-org/react";
import { HTMLAttributes } from "react";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

interface Textfield
  extends UseControllerProps<FieldValues>,
    Pick<HTMLAttributes<HTMLInputElement>, "className"> {
  isReadOnly?: boolean;
  type?: string;
  placeholder?: string;
  autoComplete?: "on" | "off";
  label?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  errorMessage?: string;
  onClick?: () => void;
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
      className={props.className}
      placeholder={props.placeholder}
      errorMessage={props.errorMessage}
      autoComplete={props.autoComplete}
      startContent={props.startContent}
      endContent={props.endContent}
      color={props.errorMessage ? "danger" : "default"}
      classNames={{
        input: cx(
          "placeholder:capitalize",
          props.isReadOnly ? "cursor-pointer" : null
        ),
        errorMessage: "capitalize font-interMedium",
        label: "font-interMedium capitalize",
        base: "z-0",
      }}
      isReadOnly={props.isReadOnly}
      onClick={props.onClick}
    />
  );
};

export interface GeneralFields
  extends Pick<
    Textfield,
    | "label"
    | "placeholder"
    | "type"
    | "autoComplete"
    | "className"
    | "isReadOnly"
  > {
  name: string;
  errorMessage: string;
  defaultValue: string;
  forField: string;
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
    autoComplete: props.autoComplete,
    placeholder: props.placeholder
      ? props.placeholder
      : `Masukkan ${props.label}`,
    errorMessage: props.errorMessage
      ? props.errorMessage
      : `Masukkan ${props.label}`,
  } satisfies PartialGeneralFields;

  return obj;
};
