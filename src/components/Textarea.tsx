import { useController } from "react-hook-form";
import { TextfieldProps } from "./Textfield";
import { Textarea as Txtarea } from "@nextui-org/react";

const Textarea = (props: TextfieldProps) => {
  const { field } = useController(props);

  return (
    <section className="flexcol gap-4">
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
        classNames={{
          input: "placeholder:capitalize",
        }}
      />
    </section>
  );
};

export default Textarea;
