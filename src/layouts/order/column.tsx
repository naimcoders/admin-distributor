import Label from "src/components/Label";
import { Actions } from "src/components/Actions";
import { Columns } from "src/types";
import { detailNavigate } from "src/helpers";

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
      header: "ID order",
      render: (v) => <Label label={v.idOrder} className="justify-center" />,
    },
    {
      header: "tanggal order",
      render: (v) => <Label label={v.orderDate} className="justify-center" />,
    },
    {
      header: "nama pemesan",
      render: (v) => <Label label={v.orderName} />,
    },
    {
      header: "nomor HP",
      render: (v) => <Label label={v.phoneNumber} className="justify-center" />,
    },
    {
      header: "nama toko",
      render: (v) => <Label label={v.storeName} />,
    },
    {
      header: "metode bayar",
      render: (v) => <Label label={v.paymentMethod} />,
    },
    {
      header: "total bayar",
      render: (v) => <Label label={v.totalPay} className="justify-end" />,
    },
    {
      header: "aksi",
      render: (v) => (
        <Actions
          id={v.idOrder}
          action="detail"
          detail={{
            onClick: () => onNav(`${tab}/${v.idOrder.replace(/\s+/g, "-")}`),
          }}
        />
      ),
    },
  ];

  return { columns };
};

export default useOrderColumns;
