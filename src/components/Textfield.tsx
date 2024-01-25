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
  type?: string;
  placeholder?: string;
  autoComplete?: "on" | "off";
  label?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  errorMessage?: string;
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
      color={props.errorMessage ? "danger" : "default"}
      classNames={{
        input: "placeholder:capitalize",
        errorMessage: "capitalize font-interMedium",
        label: "font-interMedium capitalize",
        base: "z-0",
      }}
    />
  );
};

export interface GeneralFields
  extends Pick<
    Textfield,
    "label" | "placeholder" | "type" | "autoComplete" | "className"
  > {
  name: string;
  errorMessage: string;
  defaultValue: string;
}

export type PartialGeneralFields = Partial<GeneralFields>;

export const objectFields = ({
  name,
  type,
  label,
  className,
  placeholder,
  autoComplete,
  defaultValue,
  errorMessage,
}: PartialGeneralFields): PartialGeneralFields => {
  const obj = {
    type,
    name,
    label,
    className,
    autoComplete,
    defaultValue: defaultValue ? defaultValue : "",
    placeholder: placeholder ? placeholder : `Masukkan ${label}`,
    errorMessage: errorMessage ? errorMessage : `Masukkan ${label}`,
  } satisfies PartialGeneralFields;

  return obj;
};
