import {
  FieldValues,
  UseFormClearErrors,
  UseFormSetValue,
} from "react-hook-form";

export type Radius = "full" | "lg" | "md" | "none" | "sm";
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
}

export interface TableProps<T extends object> {
  data: T[];
  columns: Columns<T>[];
  isLoading: boolean;
  page?: number;
  isNext?: boolean;
  isPaginate?: boolean;
}

export interface UseForm {
  setValue: UseFormSetValue<FieldValues>;
  clearErrors: UseFormClearErrors<FieldValues>;
}
