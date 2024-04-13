import Label from "src/components/Label";
import { Actions } from "src/components/Actions";
import { Columns } from "src/types";
import { Currency, parsePhoneNumber } from "src/helpers";
import { Order, ReqStatusOrder } from "src/api/order.service";
import { useNavigate } from "react-router-dom";

const useOrderColumns = (tab: ReqStatusOrder) => {
  const navigate = useNavigate();

  const columns: Columns<Order>[] = [
    {
      header: <p className="text-center">ID order</p>,
      render: (v) => <Label label={v.id} />,
    },
    {
      header: <p className="text-center">tanggal order</p>,
      render: (v) => <Label label={v.createdAt} />,
    },
    {
      header: <p className="text-center">nama pemesan</p>,
      render: (v) => <Label label={v.customer.name} />,
    },
    {
      header: <p className="text-center">nomor HP</p>,
      render: (v) => <Label label={parsePhoneNumber(v.customer.phoneNumber)} />,
    },
    {
      header: <p className="text-center">nama toko</p>,
      render: () => <Label label="-" />,
    },
    {
      header: <p className="text-center">metode bayar</p>,
      render: () => <Label label="-" />,
    },
    {
      header: <p className="text-right">total bayar (Rp)</p>,
      render: (v) => (
        <Label label={Currency(v.price.totalPrice)} className="justify-end" />
      ),
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
