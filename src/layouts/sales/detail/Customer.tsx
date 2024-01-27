import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { Actions } from "src/components/Actions";
import Label from "src/components/Label";
import Table from "src/components/Table";
import { detailNavigate, parsePhoneNumber } from "src/helpers";
import { Columns } from "src/types";

const Customer = () => {
  const { columns } = useHook();

  return (
    <main className="mt-5">
      <Table
        columns={columns}
        data={customers}
        isLoading={false}
        page={1}
        isNext={false}
        isPaginate
      />
    </main>
  );
};

export default Customer;

interface Customer {
  id: number;
  storeName: string;
  ownerName: string;
  phoneNumber: string;
  city: string;
  totalRevenue: number;
  totalTransaction: number;
  isVerify: boolean;
}

const customers: Customer[] = [
  {
    id: 1,
    storeName: "Maju Jaya",
    ownerName: "Andi",
    phoneNumber: "+6285867853456",
    city: "Makassar",
    totalRevenue: 85000000,
    totalTransaction: 321,
    isVerify: true,
  },
  {
    id: 2,
    storeName: "Mbak Atun",
    ownerName: "Bobi",
    phoneNumber: "+6285867853456",
    city: "Makassar",
    totalRevenue: 112980000,
    totalTransaction: 647,
    isVerify: false,
  },
];

const useHook = () => {
  const { onNav } = detailNavigate();
  const columns: Columns<Customer>[] = [
    {
      header: "nama toko",
      render: (v) => <Label label={v.storeName} />,
    },
    {
      header: "nama pemilik",
      render: (v) => (
        <Label
          label={v.ownerName}
          startContent={
            v.isVerify && <CheckBadgeIcon color="#006FEE" width={20} />
          }
        />
      ),
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
      header: "kota",
      render: (v) => <Label label={v.city} className="justify-center" />,
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
          action="detail"
          detail={{ onClick: () => onNav(`pelanggan/${v.id}`) }}
        />
      ),
    },
  ];

  return { columns };
};
