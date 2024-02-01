import cx from "classnames";
import { Input } from "@nextui-org/react";
import { HTMLAttributes, ReactNode, Ref, useState } from "react";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { ChildRef, FileProps } from "./File";
import { IconColor, Radius } from "src/types";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export interface TextfieldProps
  extends UseControllerProps<FieldValues>,
    Pick<HTMLAttributes<HTMLInputElement>, "className" | "onClick"> {
  type?: string;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  autoComplete?: "on" | "off";
  endContent?: ReactNode;
  startContent?: ReactNode;
  readOnly?: {
    isValue: boolean;
    cursor?: "cursor-text" | "cursor-pointer" | "cursor-default";
  };
  radius?: Radius;
  description?: string;
  uploadImage?: {
    file: Pick<FileProps, "onChange" | "onClick"> & {
      ref: Ref<ChildRef>;
    };
    image: {
      deleteImage: () => void;
    };
  };
}

export const Textfield = (props: TextfieldProps) => {
  const { field } = useController(props);
  const [isPass, setIsPass] = useState(false);
  const handlePass = () => setIsPass((prev) => !prev);

  return (
    <section className="flexcol gap-4">
      {props.label && <h2 className="text-sm capitalize">{props.label}</h2>}
      <Input
        {...field}
        type={
          props.type === "password"
            ? !isPass
              ? "password"
              : "text"
            : props.type
        }
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
        defaultValue={props.defaultValue ?? ""}
        classNames={{
          base: "z-0",
          errorMessage: "capitalize font-interMedium",
          description: "text-[#71717A] first-letter:capitalize",
          input: cx("placeholder:capitalize", props.readOnly?.cursor),
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
    </section>
  );
};

export const objectFields = ({
  placeholder,
  errorMessage,
  autoComplete,
  ...props
}: TextfieldProps): TextfieldProps => {
  const obj = {
    autoComplete: autoComplete ? autoComplete : "off",
    placeholder: placeholder ? placeholder : `Masukkan ${props.label}`,
    errorMessage: errorMessage ? errorMessage : `Masukkan ${props.label}`,
    ...props,
  } satisfies TextfieldProps;

  return obj;
};
