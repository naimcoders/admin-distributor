import cx from "classnames";
import Pagination from "./Pagination";
import { TableProps } from "src/types";
import { CircularProgress } from "@nextui-org/react";
import { HTMLAttributes, useEffect } from "react";
import { Textfield } from "./Textfield";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Control, FieldValues, useForm } from "react-hook-form";
import { useDebounce } from "src/helpers";
import { Button } from "./Button";

interface Table<T extends object>
  extends Pick<HTMLAttributes<HTMLDivElement>, "className">,
    TableProps<T> {
  isTransparent?: boolean;
  textColorHead?: string;
}

export default function Table<T extends object>(props: Table<T>) {
  return (
    <div className={cx("flex flex-col gap-6", props.className)}>
      <section className="relative overflow-x-auto rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right bg-white shadow-sm">
          <thead
            className={cx(
              "text-sm capitalize text-center",
              props.isTransparent ? "bg-transparent" : "bg-slate-100",
              !props.textColorHead ? "text-gray-700" : props.textColorHead
            )}
          >
            <tr>
              {props.columns.map((val, idx) => (
                <th key={idx} className={cx("px-6 py-3")}>
                  {val.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {!props.isLoading &&
              props.data &&
              props.data?.map((it, idx) => (
                <tr key={idx}>
                  {props.columns.map((col, key) => (
                    <td
                      key={key}
                      className={cx(
                        "w-full whitespace-nowrap px-5 py-2 font-medium text-gray-700 lg:w-[200px]"
                      )}
                    >
                      {col.render(it, idx)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      {props.isLoading && (
        <div>
          <CircularProgress
            size="lg"
            color="primary"
            aria-label="Loading..."
            className="mx-auto z-20"
          />
        </div>
      )}

      {!props.isLoading && props.data.length < 1 && (
        <div className="text-center font-interBold text-base">
          Tidak ada data
        </div>
      )}

      {!props.isPaginate ? null : (
        <Pagination page={props.page ?? 1} isNext={props.isNext} />
      )}
    </div>
  );
}

export interface TableLayout<T extends object> extends Table<T> {
  control: Control<FieldValues>;
  placeholder: string;
}

export function TableWithSearchAndTabs<S extends object>(
  props: TableLayout<S>
) {
  return (
    <div className="mt-5">
      <div className="sm:absolute sm:top-0 sm:right-0 sm:w-[40%]">
        <Textfield
          type="text"
          name="search"
          defaultValue=""
          autoComplete="off"
          control={props.control}
          placeholder={props.placeholder}
          startContent={<MagnifyingGlassIcon width={18} color="#808080" />}
        />
      </div>

      <Table
        columns={props.columns}
        data={props.data}
        isLoading={props.isLoading}
        className="mt-4"
        isNext={props.isNext}
        page={props.page}
        isPaginate={props.isPaginate}
      />
    </div>
  );
}

interface TableWithoutTabs<T extends object> {
  header: Header;
  table: TableProps<T>;
}

interface Header {
  search: {
    placeholder: string;
    setSearch: (v: string) => void;
  };
  createData?: {
    isValue: boolean;
    label: string;
    onClick: () => void;
  };
}

export function TableWithoutTabs<S extends object>(props: TableWithoutTabs<S>) {
  return (
    <section className="flexcol gap-8">
      <Header
        search={props.header.search}
        createData={props.header.createData}
      />

      <Table
        columns={props.table.columns}
        data={props.table.data}
        isLoading={props.table.isLoading}
        isNext={props.table.isNext}
        page={props.table.page}
        isPaginate
      />
    </section>
  );
}

const Header = ({ search, createData }: Header) => {
  const { control, watch } = useForm<FieldValues>({ mode: "onChange" });
  const debounced = useDebounce(watch("search"), 500);

  useEffect(() => {
    if (debounced) search.setSearch(debounced);
  }, [debounced]);

  return (
    <header className="flex gap-4">
      <Textfield
        name="search"
        defaultValue=""
        control={control}
        placeholder={search.placeholder}
        startContent={<MagnifyingGlassIcon width={16} color="#808080" />}
        className="lg:w-2/4"
      />

      {createData?.isValue && (
        <Button
          aria-label={createData.label}
          onClick={createData.onClick}
          startContent={<PlusIcon width={16} />}
        />
      )}
    </header>
  );
};
