import cx from "classnames";
import { Input } from "@nextui-org/react";
import { HTMLAttributes, Ref, useState } from "react";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { ChildRef, FileProps } from "./File";
import { IconColor, Radius } from "src/types";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface Textfield
  extends UseControllerProps<FieldValues>,
    Pick<HTMLAttributes<HTMLInputElement>, "className" | "onClick"> {
  type?: string;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  autoComplete?: "on" | "off";
  endContent?: React.ReactNode;
  startContent?: React.ReactNode;
  readOnly?: {
    isValue: boolean;
    cursor?: "cursor-text" | "cursor-pointer" | "cursor-default";
  };
  radius?: Radius;
  description?: string;
  classNames?: Partial<{
    inputWrapper: string;
  }>;
}

export const Textfield = (props: Textfield) => {
  const { field } = useController(props);
  const [isPass, setIsPass] = useState(false);
  const handlePass = () => setIsPass((prev) => !prev);

  return (
    <Input
      {...field}
      type={
        props.type === "password" ? (!isPass ? "password" : "text") : props.type
      }
      label={props.label}
      labelPlacement="outside"
      onClick={props.onClick}
      placeholder={props.placeholder}
      errorMessage={props.errorMessage}
      autoComplete={props.autoComplete}
      description={props.description}
      startContent={props.startContent}
      isReadOnly={props.readOnly?.isValue}
      radius={!props.radius ? "sm" : props.radius}
      className={cx("max-w-[24rem]", props.className)}
      color={props.errorMessage ? "danger" : "default"}
      classNames={{
        base: "z-0",
        input: cx("placeholder:capitalize", props.readOnly?.cursor),
        errorMessage: "capitalize font-interMedium",
        label: "font-interMedium capitalize pb-2",
        description: "text-[#71717A] first-letter:capitalize",
      }}
      title={props.defaultValue}
      endContent={
        props.type === "password" ? (
          !isPass ? (
            <EyeSlashIcon
              width={18}
              className="cursor-pointer"
              onClick={handlePass}
              color={IconColor.zinc}
              title="Show"
            />
          ) : (
            <EyeIcon
              width={18}
              color={IconColor.zinc}
              className="cursor-pointer"
              onClick={handlePass}
              title="Hide"
            />
          )
        ) : (
          props.endContent
        )
      }
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
    | "readOnly"
    | "description"
    | "onClick"
  > {
  name: string;
  errorMessage: string;
  defaultValue: string | number;
  refs: Pick<FileProps, "onChange" | "onClick"> & { ref: Ref<ChildRef> };
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
    description: props.description,
    onClick: props.onClick,
  } satisfies PartialGeneralFields;

  return obj;
};
