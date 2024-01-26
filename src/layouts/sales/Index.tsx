import { Actions } from "src/components/Actions";
import Label from "src/components/Label";
import { TableWithoutTabs } from "src/components/Table";
import { detailNavigate, parsePhoneNumber } from "src/helpers";
import { Columns } from "src/types";

const Sales = () => {
  const { columns } = useHook();
  const { onNav } = detailNavigate();

  return (
    <TableWithoutTabs
      header={{
        search: {
          placeholder: "cari nama sales/nomor HP/kategori",
          setSearch: () => console.log("set search"),
        },
        createData: {
          isValue: true,
          label: "sales",
          onClick: () => onNav("tambah"),
        },
      }}
      table={{
        columns,
        data: sales,
        isLoading: false,
      }}
    />
  );
};

interface Sales {
  id: number;
  salesName: string;
  phoneNumber: string;
  email: string;
  joiningDate: string;
  categorySales: string;
  commission: number;
  totalOmset: number;
  totalTransaction: number;
}

const sales: Sales[] = [
  {
    id: 1,
    salesName: "Andi",
    phoneNumber: "+6285824528625",
    email: "andi07@gmail.com",
    joiningDate: "13 Des 2023",
    categorySales: "Semua Kategori",
    totalOmset: 35000000,
    commission: 5,
    totalTransaction: 35,
  },
  {
    id: 2,
    salesName: "Bobi",
    phoneNumber: "+6285824528625",
    email: "bobibo@gmail.com",
    joiningDate: "12 Des 2023",
    categorySales: "Elektronik",
    totalOmset: 28746000,
    commission: 8,
    totalTransaction: 32,
  },
];

const useHook = () => {
  const { onNav } = detailNavigate();

  const columns: Columns<Sales>[] = [
    {
      header: "nama sales",
      render: (v) => <Label label={v.salesName} />,
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
      header: "kategori sales",
      render: (v) => (
        <Label label={v.categorySales} className="justify-center" />
      ),
    },
    {
      header: "kategori sales",
      render: (v) => (
        <Label label={`${v.commission}%`} className="justify-end" />
      ),
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

export default Sales;
