import Label from "src/components/Label";
import { TableWithSearchAndTabs } from "src/components/Table";
import { Product, useProduct } from "src/api/product.service";
import { FieldValues, useForm } from "react-hook-form";
import { Columns } from "src/types";
import { Actions } from "src/components/Actions";
import { useSetSearch } from "src/helpers";

const SubProduct = () => {
  const { control, watch } = useForm<FieldValues>({ mode: "onChange" });
  const { columns } = useHook();
  const { data, isLoading, page, isNext, setSearch } = useProduct().find();
  useSetSearch(watch("search"), setSearch);

  return (
    <TableWithSearchAndTabs
      columns={columns}
      control={control}
      isLoading={isLoading}
      data={data?.items ?? []}
      isNext={isNext}
      page={page}
      isPaginate
      placeholder="cari nama produk/kategori/Sub-Kategori"
    />
  );
};

const useHook = () => {
  const columns: Columns<Product>[] = [
    {
      header: <p className="text-center">nama produk</p>,
      render: (v) => <Label label={v.name} />,
    },
    {
      header: <p className="text-center">kategori</p>,
      render: (v) => <Label label={v.categoryProduct.category.name} />,
    },
    // {
    //   header: <p className="text-center">sub-kategori</p>,
    //   render: (v) => <Label label={v.categorySub} />,
    // },
    // {
    //   header: <p className="text-right">harga (Rp)</p>,
    //   render: (v) => (
    //     <Label label={Currency(v.price)} className="justify-end" />
    //   ),
    // },
    {
      header: <p className="text-center">aksi</p>,
      render: (v, idx) => (
        <Actions
          action="both"
          id={idx}
          detail={{ onClick: () => console.log(v.id) }}
        />
      ),
      width: "w-40",
    },
  ];

  return { columns };
};

export default SubProduct;
