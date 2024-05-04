import { Actions } from "src/components/Actions";
import Label from "src/components/Label";
import { TableWithoutTabs } from "src/components/Table";
import { Currency, detailNavigate, parsePhoneNumber } from "src/helpers";
import { Columns } from "src/types";

const Expedition = () => {
  const { columns } = useHook();
  const { onNav } = detailNavigate();

  return (
    <TableWithoutTabs
      header={{
        search: {
          placeholder: "cari nama ekspedisi/nomor HP",
          setSearch: () => console.log("set search"),
        },
        createData: {
          isValue: true,
          label: "ekspedisi",
          onClick: () => onNav("tambah"),
        },
      }}
      table={{
        columns,
        data: expeditions,
        isLoading: false,
      }}
    />
  );
};

interface Expedition {
  id: number;
  expeditionName: string;
  ownerName: string;
  phoneNumber: string;
  email: string;
  joiningDate: string;
  totalOmset: number;
  totalTransaction: number;
}

const expeditions: Expedition[] = [
  {
    id: 1,
    expeditionName: "Karya Agung",
    ownerName: "Andi Agung",
    phoneNumber: "+6285824528625",
    email: "andi07@gmail.com",
    joiningDate: "13 Des 2023",
    totalOmset: 35000000,
    totalTransaction: 35,
  },
  {
    id: 2,
    expeditionName: "Nusantara",
    ownerName: "Bobi Sucipta",
    phoneNumber: "+6285824528625",
    email: "bobibo@gmail.com",
    joiningDate: "12 Des 2023",
    totalOmset: 28746000,
    totalTransaction: 32,
  },
];

const useHook = () => {
  const { onNav } = detailNavigate();

  const columns: Columns<Expedition>[] = [
    {
      header: <p className="text-center">nama ekspedisi</p>,
      render: (v) => <Label label={v.expeditionName} />,
    },
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
      render: (v) => <Label label={v.joiningDate} />,
    },
    {
      header: <p className="text-center">total transaksi</p>,
      render: (v) => (
        <Label label={Currency(v.totalTransaction)} className="justify-end" />
      ),
    },
    {
      header: <p className="text-right">total omset (Rp)</p>,
      render: (v) => (
        <Label label={`${Currency(v.totalOmset)}`} className="justify-end" />
      ),
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
    },
  ];

  return { columns };
};

export default Expedition;
