import { TableWithSearchAndTabs } from "src/components/Table";
import useOrderColumns from "../column";
import { FieldValues, useForm } from "react-hook-form";
import { findOrders } from "src/api/order.service";
import Error from "src/components/Error";

const Cancel = () => {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { columns } = useOrderColumns("REJECT");
  const { data, isLoading, error, isNext, page } = findOrders("REJECT");

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

export default Cancel;
