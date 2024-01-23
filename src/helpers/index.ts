import { FieldError, FieldErrors, FieldValues } from "react-hook-form";

export const modalDOM = document.querySelector("#modal");

export const handleErrorMessage = (
  errors: FieldErrors<FieldValues>,
  data: string
): string | undefined => {
  return (errors[data] as FieldError)?.message;
};
