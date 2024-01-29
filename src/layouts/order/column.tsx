import Label from "src/components/Label";
import { Actions } from "src/components/Actions";
import { Columns } from "src/types";
import { Currency, detailNavigate } from "src/helpers";

export interface OrderProps {
  idOrder: string;
  orderDate: string;
  orderName: string;
  phoneNumber: string;
  storeName: string;
  paymentMethod: string;
  totalPay: number;
}

type Tabs = "menunggu" | "proses" | "selesai" | "batal";
const useOrderColumns = (tab: Tabs) => {
  const { onNav } = detailNavigate();

  const columns: Columns<OrderProps>[] = [
    {
      header: <p className="text-center">ID order</p>,
      render: (v) => <Label label={v.idOrder} />,
    },
    {
      header: <p className="text-center">tanggal order</p>,
      render: (v) => <Label label={v.orderDate} />,
    },
    {
      header: <p className="text-center">nama pemesan</p>,
      render: (v) => <Label label={v.orderName} />,
    },
    {
      header: <p className="text-center">nomor HP</p>,
      render: (v) => <Label label={v.phoneNumber} />,
    },
    {
      header: <p className="text-center">nama toko</p>,
      render: (v) => <Label label={v.storeName} />,
    },
    {
      header: <p className="text-center">metode bayar</p>,
      render: (v) => <Label label={v.paymentMethod} />,
    },
    {
      header: <p className="text-right">total bayar (Rp)</p>,
      render: (v) => (
        <Label label={Currency(v.totalPay)} className="justify-end" />
      ),
    },
    {
      header: <p className="text-center">aksi</p>,
      render: (v) => (
        <Actions
          id={v.idOrder}
          action="detail"
          detail={{
            onClick: () => onNav(`${tab}/${v.idOrder}`),
          }}
        />
      ),
      width: "w-40",
    },
  ];

  return { columns };
};

export default useOrderColumns;
