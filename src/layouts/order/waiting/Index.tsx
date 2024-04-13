import { useForm } from "react-hook-form";
import { TableWithSearchAndTabs } from "src/components/Table";
import useOrderColumns from "../column";
import { findOrders } from "src/api/order.service";
import Error from "src/components/Error";

const Waiting = () => {
  const { control } = useForm();
  const { columns } = useOrderColumns("WAITING_ACCEPT");
  const { isLoading, error, data, isNext, page } = findOrders("WAITING_ACCEPT");

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : (
        <TableWithSearchAndTabs
          isPaginate
          page={page}
          data={data?.items ?? []}
          isNext={isNext}
          columns={columns}
          isLoading={isLoading}
          control={control}
          placeholder="cari ID order/nama toko/pemilik/nomor HP"
        />
      )}
    </>
  );
};

export default Waiting;
