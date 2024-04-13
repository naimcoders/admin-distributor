import useOrderColumns from "../column";
import { FieldValues, useForm } from "react-hook-form";

const Process = () => {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { columns } = useOrderColumns("WAITING_ACCEPT");

  return (
    <section>
      {/* <TableWithSearchAndTabs
        page={1}
        isPaginate
        data={datas}
        isNext={false}
        columns={columns ?? []}
        isLoading={false}
        control={control}
        placeholder="cari ID order/nama toko/pemilik/nomor HP"
      /> */}
      Belum selesai
    </section>
  );
};

// const datas: OrderProps[] = [
//   {
//     idOrder: "OR 202312",
//     orderDate: "13 Des 2023",
//     orderName: "Dedi",
//     phoneNumber: "085867894321",
//     storeName: "Depo Bangunan",
//     paymentMethod: "Indomaret",
//     totalPay: 300000,
//   },
//   {
//     idOrder: "OR 202312",
//     orderDate: "13 Des 2023",
//     orderName: "Eka",
//     phoneNumber: "085867894321",
//     storeName: "Elang Perkasa",
//     paymentMethod: "OVO",
//     totalPay: 1525000,
//   },
// ];

export default Process;
