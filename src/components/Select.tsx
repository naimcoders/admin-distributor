import { Select as Listbox, SelectItem } from "@nextui-org/react";

export interface SelectDataProps {
  label: string;
  value: string;
}

interface SelectProps extends Omit<SelectDataProps, "value"> {
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
}) => {
  return (
    <Listbox
      items={data}
      label={label}
      placeholder={placeholder}
      className="max-w-xs"
      labelPlacement="outside"
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
