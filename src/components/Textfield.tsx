import { Input } from "@nextui-org/react";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

interface Textfield extends UseControllerProps<FieldValues> {
  placeholder: string;
  type: string;
  autoComplete: "on" | "off";
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
  extends Pick<Textfield, "label" | "placeholder" | "type" | "autoComplete"> {
  name: string;
  errorMessage: string;
}
