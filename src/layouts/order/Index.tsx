import Select, { SelectDataProps } from "src/components/Select";
import React from "react";
import { TableWithoutTabs } from "src/components/Table";
import {
  Order as IOrder,
  ReqStatusOrder,
  findOrders,
} from "src/api/order.service";
import useOrderColumns from "./column";
import Error from "src/components/Error";
import { setUser } from "src/stores/auth";
import { parseQueryString, stringifyQuery } from "src/helpers";
import { useNavigate } from "react-router-dom";
import Pagination from "src/components/Pagination";
import { statusOrder } from "./Detail";

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
    setPage,
  } = findOrders(selectedOrder as ReqStatusOrder, user?.id ?? "");
  const { columns } = useOrderColumns(selectedOrder);

  const onPrev = () => setPage((num) => num - 1);
  const onNext = () => setPage((num) => num + 1);

  React.useEffect(() => {
    const qs = stringifyQuery({ status: selectedOrder.toLowerCase() });
    navigate(`/order?${qs}`);
  }, [selectedOrder]);

  const waitingAccept = filterByStatusOrder(
    orders?.items ?? [],
    "WAITING_ACCEPT"
  );
  const pending = filterByStatusOrder(orders?.items ?? [], "PENDING");
  const accept = filterByStatusOrder(orders?.items ?? [], "ACCEPT");
  const itemReady = filterByStatusOrder(orders?.items ?? [], "ITEM_READY");
  const verifyPin = filterByStatusOrder(orders?.items ?? [], "VERIFY_PIN");
  const delivery = filterByStatusOrder(orders?.items ?? [], "DELIVERY");
  const complete = filterByStatusOrder(orders?.items ?? [], "COMPLETE");
  const reject = filterByStatusOrder(orders?.items ?? [], "REJECT");

  const data: SelectDataProps[] = [
    {
      label: SelectLabel("menunggu konfirmasi", waitingAccept),
      value: "WAITING_ACCEPT",
    },
    {
      label: SelectLabel("pending", pending),
      value: "PENDING",
    },
    {
      label: SelectLabel("pesanan diproses", accept),
      value: "ACCEPT",
    },
    {
      label: SelectLabel("menunggu kurir", itemReady),
      value: "ITEM_READY",
    },
    {
      label: SelectLabel("verifikasi PIN", verifyPin),
      value: "VERIFY_PIN",
    },
    {
      label: SelectLabel("pengiriman", delivery),
      value: "DELIVERY",
    },
    {
      label: SelectLabel("selesai", complete),
      value: "COMPLETE",
    },
    {
      label: SelectLabel("batal", reject),
      value: "REJECT",
    },
  ];

  return (
    <main className="mt-[2.25rem] relative">
      <Select
        data={data}
        label="jenis order"
        placeholder="pilih jenis order"
        setSelected={setSelectedOrder}
        className="w-[24rem]"
        defaultSelectedKeys={newStatus}
        textValue={statusOrder.filter((e) => e.eng === newStatus)[0].ina}
      />

      {error ? (
        <Error error={error} />
      ) : (
        <>
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
              page,
              className:
                "overflow-auto whitespace-nowrap h-calcSubDistributorTable",
            }}
          />
          <Pagination page={page} isNext={isNext} next={onNext} prev={onPrev} />
        </>
      )}
    </main>
  );
};

const filterByStatusOrder = (data: IOrder[], statusOrder: string) =>
  data.filter((v) => v.status === statusOrder);

const SelectLabel = (label: string, data: IOrder[]) => {
  return (
    <div className="flex items-center gap-2">
      {label}
      {data.length > 0 ? (
        <span className="bg-red-500 px-1 text-xs rounded-full text-white">
          {data.length}
        </span>
      ) : null}
    </div>
  );
};

export default Order;
