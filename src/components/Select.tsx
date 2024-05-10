import { Select as Listbox, SelectItem } from "@nextui-org/react";
import { HTMLAttributes } from "react";

export interface SelectDataProps {
  label: React.ReactNode;
  value: string;
}

interface SelectProps<T extends unknown>
  extends Omit<SelectDataProps, "value">,
    HTMLAttributes<HTMLInputElement> {
  data: SelectDataProps[];
  placeholder: string;
  setSelected: (v: T) => void;
  errorMessage?: string;
  defaultSelectedKeys?: string;
  textValue?: string;
}

const Select = <T extends unknown>({
  data,
  label,
  placeholder,
  errorMessage,
  setSelected,
  className,
  defaultSelectedKeys,
  textValue,
}: SelectProps<T>) => {
  return (
    <Listbox
      items={data}
      label={label}
      placeholder={placeholder}
      labelPlacement="outside"
      className={className}
      classNames={{
        label: "capitalize pb-2",
        value: "capitalize",
        errorMessage: "capitalize font-medium",
        listbox: "capitalize",
        base: "z-0",
      }}
      color={errorMessage ? "danger" : "default"}
      errorMessage={errorMessage}
      defaultSelectedKeys={defaultSelectedKeys && [defaultSelectedKeys]}
    >
      {(item) => (
        <SelectItem
          key={item.value}
          onClick={() => setSelected(item.value as T)}
          textValue={textValue}
        >
          {item.label}
        </SelectItem>
      )}
    </Listbox>
  );
};

export default Select;
