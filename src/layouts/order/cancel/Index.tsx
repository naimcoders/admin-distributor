import { TableWithSearchAndTabs } from "src/components/Table";
import useOrderColumns, { OrderProps } from "../column";
import { FieldValues, useForm } from "react-hook-form";

const Cancel = () => {
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
    orderName: "Ketut",
    phoneNumber: "085867894321",
    storeName: "Kembar Dua",
    paymentMethod: "VA Permata",
    totalPay: 723000,
  },
];

export default Cancel;
