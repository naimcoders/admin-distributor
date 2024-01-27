import { Actions } from "src/components/Actions";
import Label from "src/components/Label";
import { TableWithoutTabs } from "src/components/Table";
import { detailNavigate, parsePhoneNumber } from "src/helpers";
import { Columns } from "src/types";

const Distributor = () => {
  const { columns } = useHook();
  const { onNav } = detailNavigate();

  return (
    <TableWithoutTabs
      header={{
        search: {
          placeholder: "cari nama sub-distributor/pemilik/no HP",
          setSearch: () => console.log("set search"),
        },
        createData: {
          isValue: true,
          label: "distributor",
          onClick: () => onNav("tambah"),
        },
      }}
      table={{
        columns,
        data: distributor,
        isLoading: false,
      }}
    />
  );
};

interface Distributor {
  id: number;
  businessName: string;
  ownerName: string;
  phoneNumber: string;
  email: string;
  joiningDate: string;
  totalRevenue: number;
  totalTransaction: number;
}

const distributor: Distributor[] = [
  {
    id: 1,
    businessName: "Arta Boga",
    ownerName: "Andi",
    phoneNumber: "+6285824528625",
    email: "andi07@gmail.com",
    joiningDate: "13 Des 2023",
    totalRevenue: 85000000,
    totalTransaction: 637,
  },
  {
    id: 2,
    businessName: "Agung Jaya",
    ownerName: "Bobi",
    phoneNumber: "+6285824528625",
    email: "bobibo@gmail.com",
    joiningDate: "12 Des 2023",
    totalRevenue: 112980000,
    totalTransaction: 529,
  },
];

const useHook = () => {
  const { onNav } = detailNavigate();

  const columns: Columns<Distributor>[] = [
    {
      header: "nama usaha",
      render: (v) => <Label label={v.businessName} />,
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
      header: "total revenue",
      render: (v) => (
        <Label label={`Rp${v.totalRevenue}`} className="justify-end" />
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
    },
  ];

  return { columns };
};

export default Distributor;
