import { useEffect, useState } from "react";
import { FieldError, FieldErrors, FieldValues } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { format, fromUnixTime, getUnixTime } from "date-fns";
import idLocale from "date-fns/locale/id";
import { UseForm } from "src/types";
import queryString from "query-string";

export const parseQueryString = <T extends object>(): T => {
  const { search } = useLocation();
  const parsed = queryString.parse(search) as T;
  return parsed;
};

export const stringifyQuery = <T extends object>(prefix: T) => {
  return queryString.stringify(prefix, {
    skipEmptyString: true,
    skipNull: true,
  });
};

export const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const checkForDash = (value: string) => /-/.test(value);

export const useSetSearch = (value: string, setSearch: (v: string) => void) => {
  const debounce = useDebounce(value, 500);
  useEffect(() => {
    setSearch(debounce);
  }, [debounce]);
};

export const parseTextToNumber = (val: string) => {
  const replaceDot = val.replace(/\./g, "");
  const result = parseInt(replaceDot, 10);
  return result;
};

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

export const parsePhoneNumber = (phone?: string): string => {
  if (!phone) return "-";

  const patternCountryCode = /^\+62/;
  const patternZero = /^0/;
  if (patternCountryCode.test(phone)) {
    return `0${phone.replace(patternCountryCode, "")}`;
  } else {
    return `+62${phone.replace(patternZero, "")}`;
  }
};

export const detailNavigate = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onNav = (path: string) => navigate(`${pathname}/${path}`);
  return { onNav };
};

export const epochToDateConvert = (unixTime?: number): string => {
  if (!unixTime) return "-";
  const date = fromUnixTime(unixTime);
  const formatted = format(date, "dd MMM yyyy", { locale: idLocale });
  return formatted;
};

export const dateToEpochConvert = (date: Date) => getUnixTime(date);

export const Currency = (currency: number): string => {
  return currency.toLocaleString("id-ID");
};

export const formatToRupiah = (value: string): string => {
  const rawValue = Number(value.replace(/\D/g, ""));
  let formatted = rawValue.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  formatted = formatted.replace(/^Rp\s*/, "");
  return formatted;
};

interface CurrencyIDInputProps extends Pick<UseForm, "setValue"> {
  type: string;
  fieldName: string;
  value: string;
}
export const CurrencyIDInput = ({
  type,
  value,
  fieldName,
  setValue,
}: CurrencyIDInputProps) => {
  if (type === "rp") {
    setValue(fieldName, formatToRupiah(value));
  }
};
