import {
  Control,
  FieldErrors,
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
  width?: string | number;
}

export interface TableProps<T extends object> {
  data: T[];
  columns: Columns<T>[];
  isLoading: boolean;
  setPage: (v: number) => void;
  page?: number;
  isNext?: boolean;
  isPaginate?: boolean;
}

export interface UseForm {
  errors: FieldErrors<FieldValues>;
  control: Control<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  clearErrors: UseFormClearErrors<FieldValues>;
}

export enum IconColor {
  red = "#F31260",
  green = "#12A150",
  zinc = "#71717A",
}

export interface ActionModal {
  open: boolean;
  close: () => void;
}
