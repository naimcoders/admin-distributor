import { TableWithSearchAndTabs } from "src/components/Table";
import useOrderColumns, { OrderProps } from "../column";
import { FieldValues, useForm } from "react-hook-form";

const Waiting = () => {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { columns } = useOrderColumns("menunggu");

  return (
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
  );
};

const datas: OrderProps[] = [
  {
    idOrder: "OR 202312",
    orderDate: "13 Des 2023",
    orderName: "Arif Kurniawan",
    phoneNumber: "085867894321",
    storeName: "Agung Jaya",
    paymentMethod: "VA Mandiri",
    totalPay: 585000,
  },
];

export default Waiting;
