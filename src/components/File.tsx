import {
  forwardRef,
  Ref,
  useImperativeHandle,
  useRef,
  HTMLAttributes,
} from "react";
import Image, { IconImage } from "./Image";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { PartialGeneralFields, Textfield } from "./Textfield";
import { UseForm } from "src/types";
import { handleErrorMessage } from "src/helpers";

export interface FileProps
  extends HTMLAttributes<HTMLButtonElement | HTMLInputElement>,
    Pick<UseForm, "errors" | "control"> {
  startContent?: React.ReactNode;
}

export interface ChildRef {
  click: () => void;
}

export const File = forwardRef(
  (props: FileProps & PartialGeneralFields, ref: Ref<ChildRef>) => {
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
          name={props.name!}
          autoComplete="off"
          label={props.label}
          control={props.control}
          onClick={props.onClick}
          placeholder={props.placeholder}
          startContent={props.startContent}
          readOnly={{ isValue: true, cursor: "cursor-pointer" }}
          errorMessage={handleErrorMessage(props.errors!, props.name)}
          rules={{ required: { value: true, message: props.errorMessage! } }}
          className={props.className}
        />
      </>
    );
  }
);

interface InputFile {
  blob: string;
  file: FileProps & { ref: Ref<ChildRef> } & PartialGeneralFields;
  icons: IconImage[];
}

export const InputFile: React.FC<InputFile> = ({ blob, file, icons }) => {
  return (
    <>
      {!blob ? (
        <File
          ref={file.ref}
          name={file.name}
          errors={file.errors}
          control={file.control}
          label={file.label}
          onClick={file.onClick}
          onChange={file.onChange}
          placeholder={file.placeholder}
          startContent={<ArrowUpTrayIcon width={16} />}
          errorMessage={file.errorMessage}
          className={file.className}
        />
      ) : (
        <div className="flexcol gap-2">
          <h2 className="font-interMedium text-sm capitalize -mt-3">
            {file.label}
          </h2>
          <Image
            src={blob}
            alt="image"
            icons={icons}
            className="aspect-video object-cover"
          />
        </div>
      )}
    </>
  );
};

export const StaticImageAndTitle = (props: { label: string; src: string }) => {
  return (
    <div className="flexcol gap-2">
      <h2 className="font-interMedium text-sm capitalize -mt-3">
        {props.label}
      </h2>
      <Image
        src={props.src}
        alt="image"
        className="aspect-video object-cover"
      />
    </div>
  );
};
