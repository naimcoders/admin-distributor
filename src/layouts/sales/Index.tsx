import { Sales as ISales, findSales } from "src/api/sales.service";
import { Actions } from "src/components/Actions";
import Error from "src/components/Error";
import Label from "src/components/Label";
import { TableWithoutTabs } from "src/components/Table";
import {
  Currency,
  detailNavigate,
  parsePhoneNumber,
  parseQueryString,
} from "src/helpers";
import { Columns } from "src/types";

const Sales = () => {
  const { columns } = useHook();
  const { onNav } = detailNavigate();
  const qString = parseQueryString<{ page: number }>();
  const { data, isLoading, error, page, setSearch } = findSales(
    Number(qString.page)
  );

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : (
        <main className="overflow-auto whitespace-nowrap pb-5">
          <TableWithoutTabs
            header={{
              search: {
                placeholder: "cari nama sales/nomor HP/kategori",
                setSearch,
              },
              createData: {
                isValue: true,
                label: "sales",
                onClick: () => onNav("tambah"),
              },
            }}
            table={{
              columns,
              data: data?.items ?? [],
              isLoading,
              page,
            }}
          />
        </main>
      )}
    </>
  );
};

const useHook = () => {
  const { onNav } = detailNavigate();

  const columns: Columns<ISales>[] = [
    {
      header: <p className="text-center">nama sales</p>,
      render: (v) => <Label label={v.name} />,
    },
    {
      header: <p className="text-center">nomor HP</p>,
      render: (v) => <p>{parsePhoneNumber(v.phoneNumber)}</p>,
    },
    {
      header: <p className="text-center">email</p>,
      render: (v) => <p>{v.email}</p>,
    },
    {
      header: <p className="text-center">tanggal join</p>,
      render: (v) => <p>{v.createdAt}</p>,
    },
    {
      header: <p className="text-center">aksi</p>,
      render: (v, idx) => (
        <Actions
          id={idx}
          action="switchAndDetail"
          switch={{
            isSelected: true,
          }}
          detail={{
            onClick: () => onNav(String(v.id)),
          }}
        />
      ),
      width: "w-40",
    },
  ];

  return { columns };
};

export default Sales;
