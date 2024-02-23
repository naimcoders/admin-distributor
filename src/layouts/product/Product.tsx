import Label from "src/components/Label";
import { TableWithSearchAndTabs } from "src/components/Table";
import { Product, useProduct } from "src/api/product.service";
import { FieldValues, useForm } from "react-hook-form";
import { Columns } from "src/types";

const SubProduct = () => {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { columns } = useHook();
  const { data, isLoading, page, isNext } = useProduct().find();

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
    // {
    //   header: <p className="text-center">aksi</p>,
    //   render: (_, idx) => <Actions action="both" id={idx} />,
    //   width: "w-40",
    // },
  ];

  return { columns };
};

export default SubProduct;
