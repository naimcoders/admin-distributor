import Error from "src/components/Error";
import Label from "src/components/Label";
import { Distributor, useDistributor } from "src/api/distributor.service";
import { Actions } from "src/components/Actions";
import { TableWithoutTabs } from "src/components/Table";
import {
  detailNavigate,
  epochToDateConvert,
  parsePhoneNumber,
} from "src/helpers";
import { Columns } from "src/types";

const Distributor = () => {
  const { columns } = useHook();
  const { onNav } = detailNavigate();
  const { data, isLoading, error, page, setPage, setSearch, isNext } =
    useDistributor().find();

  const prev = () => setPage((num) => num - 1);
  const next = () => setPage((num) => num + 1);

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : (
        <TableWithoutTabs
          header={{
            search: {
              placeholder: "cari nama sub-distributor/pemilik/no HP",
              setSearch,
            },
            createData: {
              isValue: true,
              label: "distributor",
              onClick: () => onNav("tambah"),
            },
          }}
          table={{
            columns,
            data: data?.items ?? [],
            isLoading,
            isNext,
            page,
            next,
            prev,
          }}
        />
      )}
    </>
  );
};

// interface Distributor {
//   id: number;
//   businessName: string;
//   ownerName: string;
//   phoneNumber: string;
//   email: string;
//   joiningDate: string;
//   totalRevenue: number;
//   totalTransaction: number;
// }

// const distributor: Distributor[] = [
//   {
//     id: 1,
//     businessName: "Arta Boga",
//     ownerName: "Andi",
//     phoneNumber: "+6285824528625",
//     email: "andi07@gmail.com",
//     joiningDate: "13 Des 2023",
//     totalRevenue: 85000000,
//     totalTransaction: 637,
//   },
//   {
//     id: 2,
//     businessName: "Agung Jaya",
//     ownerName: "Bobi",
//     phoneNumber: "+6285824528625",
//     email: "bobibo@gmail.com",
//     joiningDate: "12 Des 2023",
//     totalRevenue: 112980000,
//     totalTransaction: 529,
//   },
// ];

const useHook = () => {
  const { onNav } = detailNavigate();

  const columns: Columns<Distributor>[] = [
    {
      header: <p className="text-center">nama pemilik</p>,
      render: (v) => <Label label={v.ownerName} />,
    },
    {
      header: <p className="text-center">nomor HP</p>,
      render: (v) => <Label label={parsePhoneNumber(v.phoneNumber)} />,
    },
    {
      header: <p className="text-center">email</p>,
      render: (v) => <Label label={v.email} />,
    },
    {
      header: <p className="text-center">tanggal join</p>,
      render: (v) => <Label label={epochToDateConvert(v.createdAt)} />,
    },
    {
      header: <p className="text-center">aksi</p>,
      render: (v, idx) => (
        <Actions
          id={idx}
          action="both"
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

export default Distributor;
