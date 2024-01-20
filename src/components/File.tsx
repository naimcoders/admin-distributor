import cx from "classnames";
import Image, { IconImage } from "./Image";
import {
  forwardRef,
  Ref,
  useImperativeHandle,
  useRef,
  HTMLAttributes,
} from "react";
import { Button as Btn } from "@nextui-org/react";

type ButtonElement = HTMLAttributes<HTMLInputElement | HTMLButtonElement>;
type ImageElement = Partial<HTMLImageElement>;

interface File extends ButtonElement {
  btnLabel: string;
  title?: string;
  errorMessage?: string;
  startContent?: React.ReactNode;
}

const Button = (props: File) => {
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

type ForwardRef = File & {
  image?: ImageElement;
  icons?: IconImage[];
};

export const File = forwardRef((props: ForwardRef, ref: Ref<ChildRef>) => {
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

      <div className="flex flex-col">
        <h2 className="capitalize font-interMedium text-sm mb-1">
          {props.title}
        </h2>

        {!props.image?.src ? (
          <Button
            title={props.title}
            btnLabel={props.btnLabel}
            onClick={props.onClick}
            startContent={props.startContent}
            className={!props.errorMessage ? "" : "bg-red-200 text-red-800"}
          />
        ) : (
          <Image
            src={props.image?.src}
            alt={props.title}
            loading="lazy"
            width={props.image.width}
            icons={props.icons}
          />
        )}

        {!props.errorMessage ? null : (
          <p className="text-red-500 text-xs capitalize font-interMedium mt-1">
            {props.errorMessage}
          </p>
        )}
      </div>
    </>
  );
});
