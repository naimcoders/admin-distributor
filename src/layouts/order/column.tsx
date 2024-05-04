import Label from "src/components/Label";
import { Actions } from "src/components/Actions";
import { Columns } from "src/types";
import { Currency, epochToDateConvert, parsePhoneNumber } from "src/helpers";
import { Order } from "src/api/order.service";
import { useNavigate } from "react-router-dom";

const useOrderColumns = (tab: string) => {
  const navigate = useNavigate();

  const columns: Columns<Order>[] = [
    {
      header: <p className="text-center">ID order</p>,
      render: (v) => <p className="truncate">{v.id}</p>,
      width: "max-w-[8rem]",
    },
    {
      header: <p className="text-center">tanggal order</p>,
      render: (v) => (
        <p className="truncate">{epochToDateConvert(v.createdAt)}</p>
      ),
      width: "max-w-[5rem]",
    },
    {
      header: <p className="text-center">nama pemesan</p>,
      render: (v) => <p className="truncate">{v.customer.name}</p>,
      width: "max-w-[10rem]",
    },
    {
      header: <p className="text-center">nomor HP</p>,
      render: (v) => <Label label={parsePhoneNumber(v.customer.phoneNumber)} />,
      width: "max-w-[10rem]",
    },
    {
      header: <p className="text-center">nama toko</p>,
      render: () => <p className="truncate">-</p>,
      width: "max-w-[10rem]",
    },
    {
      header: <p className="text-center">metode bayar</p>,
      render: () => <p className="truncate">-</p>,
      width: "max-w-[10rem]",
    },
    {
      header: <p className="text-right">total bayar (Rp)</p>,
      render: (v) => (
        <p className="truncate text-right">{Currency(v.price.totalPrice)}</p>
      ),
      width: "max-w-[8rem]",
    },
    {
      header: <p className="text-center">aksi</p>,
      render: (v) => (
        <Actions
          id={v.id}
          action="detail"
          detail={{
            onClick: () => navigate(`${tab.toLowerCase()}/${v.id}`),
          }}
        />
      ),
      width: "w-40",
    },
  ];

  return { columns };
};

export default useOrderColumns;
