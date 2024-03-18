import cx from "classnames";
import { Input } from "@nextui-org/react";
import { HTMLAttributes, KeyboardEvent, ReactNode, Ref, useState } from "react";
import { UseControllerProps, useController } from "react-hook-form";
import { ChildRef, FileProps } from "./File";
import { IconColor, Radius } from "src/types";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
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

export interface TextfieldProps
  extends UseControllerProps<any>,
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
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export const Textfield = (props: TextfieldProps) => {
  const { field } = useController(props);
  const [isPass, setIsPass] = useState(false);
  const handlePass = () => setIsPass((prev) => !prev);

  return (
    <section className={cx("flexcol gap-4", props.classNameWrapper)}>
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

export const TextfieldCurrency = (props: TextfieldProps) => {
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

export const objectFields = ({
  placeholder,
  errorMessage,
  autoComplete,
  ...props
}: TextfieldProps): TextfieldProps => {
  const obj = {
    autoComplete: autoComplete ? autoComplete : "off",
    placeholder: placeholder
      ? placeholder
      : `Masukkan ${props.label?.replace("*", "")}`,
    errorMessage: errorMessage
      ? errorMessage
      : `Masukkan ${props.label?.replace("*", "")}`,
    ...props,
  } satisfies TextfieldProps;

  return obj;
};
