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
}

export default function Table<T extends object>(props: Table<T>) {
  return (
    <div className={cx("flex flex-col gap-6", props.className)}>
      <section className="relative">
        <table className="w-full text-left bg-white shadow-sm table-fixed">
          <thead
            className={cx(
              "capitalize text-gray-700 border border-gray-300 bg-[#F4F4F5]",
              props.isTransparent ? "bg-transparent" : "bg-slate-100"
            )}
          >
            <tr>
              {props.columns.map((val, idx) => (
                <th
                  key={idx}
                  className={cx(
                    "p-3 font-semibold border border-gray-300 W-12 text-[13px]",
                    val.width
                  )}
                >
                  {val.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="border border-gray-300">
            {!props.isLoading &&
              props.data &&
              props.data?.map((it, idx) => (
                <tr key={idx}>
                  {props.columns.map((col, key) => (
                    <td
                      key={key}
                      className={cx(
                        "text-[13px] p-3 text-gray-700 W-12 border border-gray-300"
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
        <Pagination
          page={props.page ?? 1}
          isNext={props.isNext}
          setPage={props.setPage}
        />
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
    <div>
      <Textfield
        type="text"
        name="search"
        defaultValue=""
        control={props.control}
        placeholder={props.placeholder}
        className="sm:absolute sm:top-0 sm:right-0 w-[24rem]"
        startContent={<MagnifyingGlassIcon width={18} color="#808080" />}
      />

      <Table
        isPaginate
        className="mt-4"
        data={props.data}
        page={props.page}
        isNext={props.isNext}
        columns={props.columns}
        isLoading={props.isLoading}
        setPage={() => console.log("d")}
      />
    </div>
  );
}

interface TableWithoutTabs<T extends object> {
  header: HeaderProps;
  table: TableProps<T>;
}

interface HeaderProps {
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
        setPage={props.table.setPage}
        isPaginate
      />
    </section>
  );
}

const Header = ({ search, createData }: HeaderProps) => {
  const { control, watch } = useForm<FieldValues>({ mode: "onChange" });
  const debounced = useDebounce(watch("search"), 500);

  useEffect(() => {
    if (debounced) search.setSearch(debounced);
  }, [debounced]);

  return (
    <header className="flex gap-4">
      <Textfield
        type="text"
        name="search"
        defaultValue=""
        control={control}
        className="w-[24rem]"
        placeholder={search.placeholder}
        startContent={<MagnifyingGlassIcon width={16} color="#808080" />}
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
