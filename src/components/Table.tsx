import cx from "classnames";
import { TableProps } from "src/types";
import { CircularProgress } from "@nextui-org/react";
import { HTMLAttributes, useEffect } from "react";
import { Textfield } from "./Textfield";
import { HiOutlinePlus, HiOutlineMagnifyingGlass } from "react-icons/hi2";
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
    <section className={cx("relative flex flex-col gap-4", props.className)}>
      <table className="min-w-full text-left bg-white shadow-sm">
        <thead
          className={cx(
            "capitalize text-gray-700 border border-gray-300 sticky top-0 z-10",
            props.isTransparent ? "bg-transparent" : "bg-[#F4F4F5]"
          )}
        >
          <tr>
            {props.columns.map((val, idx) => (
              <th
                key={idx}
                className={cx(
                  "text-[13px] p-3 text-gray-700 border border-gray-300"
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
                      "text-[13px] p-3 text-gray-700 border border-gray-300 truncate",
                      col.width
                    )}
                  >
                    {col.render(it, idx)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      {props.isLoading && (
        <section>
          <CircularProgress
            size="lg"
            color="primary"
            aria-label="Loading..."
            className="mx-auto z-20"
          />
        </section>
      )}

      {!props.isLoading && props.data.length < 1 && (
        <div className="text-center font-bold text-base">Tidak ada data</div>
      )}

      {/* {!props.isPaginate ? null : (
        <Pagination
          page={props.page ?? 1}
          isNext={props.isNext}
          next={props.next}
          prev={props.prev}
        />
      )} */}
    </section>
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
    <section>
      <Textfield
        type="text"
        name="search"
        defaultValue=""
        control={props.control}
        placeholder={props.placeholder}
        className="lg:absolute lg:top-0 lg:right-0 w-[24rem] mt-5 lg:mt-0"
        startContent={<HiOutlineMagnifyingGlass size={18} color="#808080" />}
      />

      <Table
        className={cx("mt-4", props.className)}
        data={props.data}
        page={props.page}
        columns={props.columns}
        isLoading={props.isLoading}
      />
    </section>
  );
}

interface TableWithoutTabs<T extends object> {
  header: HeaderProps;
  table: Table<T>;
}

interface HeaderProps {
  search: {
    placeholder: string;
    setSearch: (v: string) => void;
    className?: string;
  };
  createData?: {
    isValue: boolean;
    label: string;
    onClick: () => void;
  };
}

export function TableWithoutTabs<S extends object>(props: TableWithoutTabs<S>) {
  return (
    <section className="flex flex-col gap-8">
      <Header
        search={props.header.search}
        createData={props.header.createData}
      />

      <Table
        columns={props.table.columns}
        data={props.table.data}
        isLoading={props.table.isLoading}
        page={props.table.page}
        className={props.table.className}
      />
    </section>
  );
}

const Header = ({ search, createData }: HeaderProps) => {
  const { control, watch } = useForm<FieldValues>();
  const debounced = useDebounce(watch("search"), 500);

  useEffect(() => {
    search.setSearch(debounced);
  }, [debounced]);

  return (
    <header className="flex gap-4">
      <Textfield
        type="text"
        name="search"
        defaultValue=""
        control={control}
        className={cx("w-[24rem]", search.className)}
        placeholder={search.placeholder}
        startContent={<HiOutlineMagnifyingGlass size={16} color="#808080" />}
      />

      {createData?.isValue && (
        <Button
          label={createData.label}
          onClick={createData.onClick}
          startContent={<HiOutlinePlus size={16} />}
        />
      )}
    </header>
  );
};
