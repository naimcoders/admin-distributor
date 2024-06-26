import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormSetValue,
} from "react-hook-form";

export type Radius = "full" | "lg" | "md" | "none" | "sm";
export type Size = "lg" | "md" | "sm";
export type Color =
  | "success"
  | "primary"
  | "secondary"
  | "warning"
  | "danger"
  | "default";

export interface Columns<S extends object, v = React.ReactNode> {
  header: v;
  render(type: S, index: number): React.ReactNode;
  width?: string | number;
}

export interface TableProps<T extends object> {
  data: T[];
  columns: Columns<T>[];
  isLoading: boolean;
  page?: number;
}

export interface UseForm {
  errors: FieldErrors<any>;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  clearErrors: UseFormClearErrors<any>;
}

export enum IconColor {
  red = "#F31260",
  green = "#4ea832",
  zinc = "#71717A",
}

export interface ActionModal {
  open: boolean;
  close: () => void;
}
