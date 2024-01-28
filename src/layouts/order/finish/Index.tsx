import { TableWithSearchAndTabs } from "src/components/Table";
import useOrderColumns, { OrderProps } from "../column";
import { FieldValues, useForm } from "react-hook-form";

const Finish = () => {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { columns } = useOrderColumns();

  return (
    <section>
      <TableWithSearchAndTabs
        page={1}
        isPaginate
        data={datas}
        isNext={false}
        columns={columns}
        isLoading={false}
        control={control}
        placeholder="cari ID order/nama toko/pemilik/nomor HP"
      />
    </section>
  );
};

const datas: OrderProps[] = [
  {
    idOrder: "OR 202312",
    orderDate: "13 Des 2023",
    orderName: "Guntur",
    phoneNumber: "085867894321",
    storeName: "Gunung Mas",
    paymentMethod: "VA BCA",
    totalPay: 356000,
  },
  {
    idOrder: "OR 202312",
    orderDate: "13 Des 2023",
    orderName: "Heni",
    phoneNumber: "085867894321",
    storeName: "Intan Mulia",
    paymentMethod: "Pilipay",
    totalPay: 284000,
  },
];

export default Finish;
