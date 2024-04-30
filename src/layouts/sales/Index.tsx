import { Actions } from "src/components/Actions";
import Label from "src/components/Label";
import { TableWithoutTabs } from "src/components/Table";
import { Currency, detailNavigate, parsePhoneNumber } from "src/helpers";
import { Columns } from "src/types";

const Sales = () => {
  const { columns } = useHook();
  const { onNav } = detailNavigate();

  return (
    <main className="overflow-auto whitespace-nowrap pb-5">
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
    </main>
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
      header: <p className="text-center">nama sales</p>,
      render: (v) => <Label label={v.salesName} />,
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
      header: <p className="text-center">kategori sales</p>,
      render: (v) => <Label label={v.categorySales} />,
    },
    {
      header: <p className="text-center">komisi</p>,
      render: (v) => (
        <Label label={`${v.commission}%`} className="justify-end" />
      ),
    },
    {
      header: <p className="text-center">total transaksi</p>,
      render: (v) => (
        <Label label={v.totalTransaction} className="justify-end" />
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

export default Sales;
