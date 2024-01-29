import { Select as Listbox, SelectItem } from "@nextui-org/react";
import { HTMLAttributes } from "react";

export interface SelectDataProps {
  label: string;
  value: string;
}

interface SelectProps
  extends Omit<SelectDataProps, "value">,
    HTMLAttributes<HTMLInputElement> {
  data: SelectDataProps[];
  placeholder: string;
  setSelected: (v: string) => void;
  errorMessage?: string;
}

const Select: React.FC<SelectProps> = ({
  data,
  label,
  placeholder,
  errorMessage,
  setSelected,
  className,
}) => {
  return (
    <Listbox
      items={data}
      label={label}
      placeholder={placeholder}
      labelPlacement="outside"
      className={className}
      classNames={{
        label: "capitalize font-interMedium",
        value: "capitalize",
        errorMessage: "capitalize font-interMedium",
        listbox: "capitalize",
        base: "z-0",
      }}
      color={errorMessage ? "danger" : "default"}
      errorMessage={errorMessage}
    >
      {(item) => (
        <SelectItem key={item.value} onClick={() => setSelected(item.value)}>
          {item.label}
        </SelectItem>
      )}
    </Listbox>
  );
};

export default Select;
