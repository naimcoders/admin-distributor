import Select, { SelectDataProps } from "src/components/Select";
import React from "react";
import { TableWithoutTabs } from "src/components/Table";
import { ReqStatusOrder, findOrders } from "src/api/order.service";
import useOrderColumns from "./column";
import Error from "src/components/Error";
import { setUser } from "src/stores/auth";
import { parseQueryString, stringifyQuery } from "src/helpers";
import { useNavigate } from "react-router-dom";

const data: SelectDataProps[] = [
  { label: "menunggu diterima", value: "WAITING_ACCEPT" },
  { label: "pending", value: "PENDING" },
  { label: "diterima", value: "ACCEPT" },
  { label: "barang siap", value: "ITEM_READY" },
  { label: "verifikasi PIN", value: "VERIFY_PIN" },
  { label: "pengiriman", value: "DELIVERY" },
  { label: "selesai", value: "COMPLETE" },
  { label: "batal", value: "REJECT" },
];

const Order = () => {
  const { status } = parseQueryString<{ status: string }>();
  const newStatus = status.toUpperCase();
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = React.useState(newStatus);
  const user = setUser((v) => v.user);

  const {
    data: orders,
    error,
    isLoading,
    isNext,
    page,
    setSearch,
  } = findOrders(selectedOrder as ReqStatusOrder, user?.id ?? "");
  const { columns } = useOrderColumns(selectedOrder);

  React.useEffect(() => {
    const qs = stringifyQuery({ status: selectedOrder.toLowerCase() });
    navigate(`/order?${qs}`);
  }, [selectedOrder]);

  return (
    <main className="mt-[2.25rem] relative">
      <Select
        data={data}
        label="jenis order"
        placeholder="pilih jenis order"
        setSelected={setSelectedOrder}
        className="w-[24rem]"
        defaultSelectedKeys={newStatus}
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
