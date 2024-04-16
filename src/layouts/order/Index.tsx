import Select, { SelectDataProps } from "src/components/Select";
import React from "react";
import { TableWithoutTabs } from "src/components/Table";
import { ReqStatusOrder, findOrders } from "src/api/order.service";
import useOrderColumns from "./column";
import Error from "src/components/Error";
import { setUser } from "src/stores/auth";

const data: SelectDataProps[] = [
  { label: "menunggu", value: "WAITING_ACCEPT" },
  { label: "pengiriman", value: "DELIVERY" },
  { label: "diterima", value: "ACCEPT" },
  { label: "selesai", value: "COMPLETE" },
  { label: "tertunda", value: "PENDING" },
  { label: "batal", value: "REJECT" },
  { label: "barang siap", value: "ITEM_READY" },
  { label: "verifikasi PIN", value: "VERIFY_PIN" },
];

const Order = () => {
  const [selectedOrder, setSelectedOrder] =
    React.useState<ReqStatusOrder>("WAITING_ACCEPT");
  const user = setUser((v) => v.user);
  const {
    data: orders,
    error,
    isLoading,
    isNext,
    page,
    setSearch,
  } = findOrders(selectedOrder, user?.id ?? "");
  const { columns } = useOrderColumns(selectedOrder);

  return (
    <main className="mt-[2.25rem] relative">
      <Select
        data={data}
        label="jenis order"
        placeholder="pilih jenis order"
        setSelected={setSelectedOrder}
        className="w-[24rem]"
        defaultSelectedKeys="WAITING_ACCEPT"
      />
      {error ? (
        <Error error={error} />
      ) : (
        <TableWithoutTabs
          header={{
            search: {
              placeholder: "cari ID order/nama toko/pemilik/nomor HP",
              setSearch,
              className: "lg:absolute lg:top-0 lg:right-0 mt-6 lg:mt-0",
            },
          }}
          table={{
            data: orders?.items ?? [],
            columns,
            isLoading,
            isNext,
            isPaginate: true,
            page,
          }}
        />
      )}
    </main>
  );
};

export default Order;
