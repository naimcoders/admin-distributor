import { TableWithSearchAndTabs } from "src/components/Table";
import useOrderColumns from "../column";
import { useForm } from "react-hook-form";
import { findOrders } from "src/api/order.service";
import Error from "src/components/Error";

const Finish = () => {
  const { control } = useForm();
  const { columns } = useOrderColumns("ACCEPT");
  const { data, isLoading, error, isNext, page } = findOrders("ACCEPT");

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : (
        <TableWithSearchAndTabs
          page={page}
          isPaginate
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

export default Finish;
