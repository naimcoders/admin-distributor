import { useEffect, useState } from "react";
import { FieldError, FieldErrors, FieldValues } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { format, fromUnixTime, getUnixTime } from "date-fns";
import idLocale from "date-fns/locale/id";

export const modalDOM = document.querySelector("#modal");

export const handleErrorMessage = (
  errors: FieldErrors<FieldValues>,
  data?: string
): string | undefined => {
  return (errors[data ?? ""] as FieldError)?.message;
};

export const useDebounce = (value: string, delay: number) => {
  const [debounce, setDebounce] = useState(value);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebounce(value);
    }, delay);
    return () => clearTimeout(timeOut);
  }, [value, delay]);
  return debounce;
};

export const parsePhoneNumber = (val: string): string => {
  const pattern = /^\+62/;
  const cutValue = val.replace(pattern, "");
  return pattern.test(val) ? `0${cutValue}` : val;
};

export const detailNavigate = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onNav = (path: string) => navigate(`${pathname}/${path}`);
  return { onNav };
};

export const CreateObject = <T extends object>(data: T): T => {
  let resultObj = {} as T;
  for (const key in data) {
    resultObj[key] = data[key];
  }
  return resultObj;
};

export const epochToDateConvert = (unixTime: number) => {
  const date = fromUnixTime(unixTime);
  const formatted = format(date, "dd MMM yyyy", { locale: idLocale });
  return formatted;
};

export const dateToEpochConvert = (date: Date) => getUnixTime(date);
