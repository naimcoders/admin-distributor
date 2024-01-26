import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { Actions } from "src/components/Actions";
import Label from "src/components/Label";
import Rating from "src/components/Rating";
import { TableWithoutTabs } from "src/components/Table";
import { detailNavigate, parsePhoneNumber } from "src/helpers";
import { Columns } from "src/types";

const Store = () => {
  const { columns } = useStore();

  return (
    <main>
      <TableWithoutTabs
        header={{
          search: {
            placeholder: "cari nama toko/pemilik/no HP/PIC Sales",
            setSearch: () => console.log("dadsa"),
          },
        }}
        table={{
          columns,
          data: storeDatas,
          isLoading: false,
          isNext: false,
          page: 1,
        }}
      />
    </main>
  );
};

interface Store {
  id: number;
  storeName: string;
  rate: number;
  ownerName: string;
  phoneNumber: string;
  picSales: string;
  totalRevenue: number;
  totalTransaction: number;
  isVerify: boolean;
}

const storeDatas: Store[] = [
  {
    id: 1,
    storeName: "Maju Jaya",
    rate: 0,
    ownerName: "Andi",
    isVerify: true,
    phoneNumber: "+6285824528625",
    picSales: "-",
    totalRevenue: 85000000,
    totalTransaction: 321,
  },
  {
    id: 2,
    storeName: "Mbak Atun",
    rate: 0,
    ownerName: "Bobi",
    isVerify: false,
    phoneNumber: "+6285824528625",
    picSales: "Cahyo",
    totalRevenue: 112980000,
    totalTransaction: 647,
  },
];

const useStore = () => {
  const { onNav } = detailNavigate();

  const columns: Columns<Store>[] = [
    {
      header: "nama toko",
      render: (v) => <Label label={v.storeName} />,
    },
    {
      header: "rating",
      render: (v) => <Rating value={v.rate} className="justify-center" />,
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
      header: "PIC Sales",
      render: (v) => <Label label={v.picSales} className="justify-center" />,
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
          detail={{
            onClick: () => onNav(String(v.id)),
          }}
        />
      ),
    },
  ];

  return { columns };
};

export default Store;
