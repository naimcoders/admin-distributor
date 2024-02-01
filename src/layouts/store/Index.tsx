import { CheckBadgeIcon, StarIcon } from "@heroicons/react/24/solid";
import { Actions } from "src/components/Actions";
import Label from "src/components/Label";
import { TableWithoutTabs } from "src/components/Table";
import { Currency, detailNavigate, parsePhoneNumber } from "src/helpers";
import { Columns } from "src/types";

const Store = () => {
  const { columns } = useStore();

  return (
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
    rate: 3.8,
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
    rate: 4.9,
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
      header: <p className="text-center">nama toko</p>,
      render: (v) => <Label label={v.storeName} />,
    },
    {
      header: <p className="text-center">rating</p>,
      render: (v) => (
        <div className="flex gap-1 justify-center p-0">
          <StarIcon color="#cbde23" width={16} />
          <Label label={v.rate} />
        </div>
      ),
    },
    {
      header: <p className="text-center">nama pemilik</p>,
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
      header: <p className="text-center">nomor HP</p>,
      render: (v) => <Label label={parsePhoneNumber(v.phoneNumber)} />,
    },
    {
      header: <p className="text-center">PIC Sales</p>,
      render: (v) => <Label label={v.picSales} />,
    },
    {
      header: <p className="text-center">total transaksi</p>,
      render: (v) => (
        <Label label={Currency(v.totalTransaction)} className="justify-end" />
      ),
    },
    {
      header: <p className="text-right">total revenue (Rp)</p>,
      render: (v) => (
        <Label label={`${Currency(v.totalRevenue)}`} className="justify-end" />
      ),
    },
    {
      header: <p className="text-center">aksi</p>,
      render: (v, idx) => (
        <Actions
          id={idx}
          action="detail"
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

export default Store;
