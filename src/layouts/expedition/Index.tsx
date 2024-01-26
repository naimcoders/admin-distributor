import { Actions } from "src/components/Actions";
import Label from "src/components/Label";
import { TableWithoutTabs } from "src/components/Table";
import { detailNavigate, parsePhoneNumber } from "src/helpers";
import { Columns } from "src/types";

const Expedition = () => {
  const { columns } = useHook();
  const { onNav } = detailNavigate();

  return (
    <main>
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
    </main>
  );
};

interface Expedition {
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
    expeditionName: "Karya Agung",
    ownerName: "Andi Agung",
    phoneNumber: "+6285824528625",
    email: "andi07@gmail.com",
    joiningDate: "13 Des 2023",
    totalOmset: 35000000,
    totalTransaction: 35,
  },
  {
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
  const columns: Columns<Expedition>[] = [
    {
      header: "nama ekspedisi",
      render: (v) => <Label label={v.expeditionName} />,
    },
    {
      header: "nama pemilik",
      render: (v) => <Label label={v.ownerName} />,
    },
    {
      header: "nomor HP",
      render: (v) => (
        <Label
          label={parsePhoneNumber(v.phoneNumber)}
          className="justify-center"
        />
      ),
    },
    {
      header: "email",
      render: (v) => <Label label={v.email} className="justify-center" />,
    },
    {
      header: "tanggal join",
      render: (v) => <Label label={v.joiningDate} className="justify-center" />,
    },
    {
      header: "total omset",
      render: (v) => (
        <Label label={`Rp${v.totalOmset}`} className="justify-end" />
      ),
    },
    {
      header: "total transaksi",
      render: (v) => (
        <Label label={v.totalTransaction} className="justify-end" />
      ),
    },
    {
      header: "aksi",
      render: (_, idx) => (
        <Actions
          id={idx}
          action="both"
          switch={{
            isSelected: true,
          }}
        />
      ),
    },
  ];

  return { columns };
};

export default Expedition;
