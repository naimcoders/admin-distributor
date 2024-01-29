import cx from "classnames";
import {
  forwardRef,
  Ref,
  useImperativeHandle,
  useRef,
  HTMLAttributes,
} from "react";
import { Button as Btn } from "@nextui-org/react";
import Image, { IconImage } from "./Image";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

type ButtonElement = HTMLAttributes<HTMLInputElement | HTMLButtonElement>;

export interface FileProps extends ButtonElement {
  btnLabel: string;
  errorMessage?: string;
  startContent?: React.ReactNode;
}

const Button = (props: FileProps) => {
  return (
    <Btn
      radius="sm"
      onClick={props.onClick}
      startContent={props.startContent}
      className={cx(
        "capitalize border-1 border-dashed border-gray-500 w-full",
        props.className
      )}
    >
      {props.btnLabel}
    </Btn>
  );
};

export interface ChildRef {
  click: () => void;
}

export const File = forwardRef((props: FileProps, ref: Ref<ChildRef>) => {
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

      <Button
        btnLabel={props.btnLabel}
        onClick={props.onClick}
        startContent={props.startContent}
        className={!props.errorMessage ? "" : "bg-red-200 text-red-800"}
      />

      {!props.errorMessage ? null : (
        <p className="text-red-500 text-xs capitalize font-interMedium mt-1">
          {props.errorMessage}
        </p>
      )}
    </>
  );
});

interface InputFile {
  label: string;
  blob: string;
  file: FileProps & {
    btnLabel: string;
    ref: Ref<ChildRef>;
  };
  icons: IconImage[];
}

export const InputFile: React.FC<InputFile> = ({
  label,
  blob,
  file,
  icons,
}) => {
  return (
    <div className="flexcol gap-4">
      <h2 className="text-sm font-interMedium capitalize">{label}</h2>
      {!blob ? (
        <File
          btnLabel={file.btnLabel}
          ref={file.ref}
          onChange={file.onChange}
          onClick={file.onClick}
          startContent={<ArrowUpTrayIcon width={16} />}
        />
      ) : (
        <Image src={blob} alt="image" icons={icons} />
      )}
    </div>
  );
};
