import cx from "classnames";
import { useController } from "react-hook-form";
import { TextfieldProps } from "./Textfield";
import { Textarea as Txtarea } from "@nextui-org/react";

const Textarea = (props: TextfieldProps<any>) => {
  const { field } = useController(props);

  return (
    <section className={cx("flexcol gap-4", props.classNameWrapper)}>
      {props.label && (
        <label htmlFor={props.label} className="text-sm capitalize">
          {props.label}
        </label>
      )}
      <Txtarea
        {...field}
        id={props.label}
        radius={props.radius}
        description={props.description}
        placeholder={props.placeholder}
        errorMessage={props.errorMessage}
        classNames={{
          input: "placeholder:capitalize",
          errorMessage: "capitalize font-interMedium",
        }}
      />
    </section>
  );
};

export default Textarea;
