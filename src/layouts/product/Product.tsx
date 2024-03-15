import Label from "src/components/Label";
import { TableWithSearchAndTabs } from "src/components/Table";
import { Product, useProduct } from "src/api/product.service";
import { FieldValues, useForm } from "react-hook-form";
import { Columns } from "src/types";
import { Actions } from "src/components/Actions";
import { epochToDateConvert, useSetSearch } from "src/helpers";
import { useNavigate } from "react-router-dom";

const SubProduct = () => {
  const { control, watch } = useForm<FieldValues>({ mode: "onChange" });
  const { columns } = useHook();
  const { data, isLoading, page, isNext, setSearch, setPage } =
    useProduct().find();
  useSetSearch(watch("search"), setSearch);

  const onNext = () => setPage((v) => v + 1);
  const onPrev = () => setPage((v) => v - 1);

  return (
    <TableWithSearchAndTabs
      columns={columns}
      control={control}
      isLoading={isLoading}
      data={data?.items ?? []}
      isNext={isNext}
      page={page}
      next={onNext}
      prev={onPrev}
      isPaginate
      placeholder="cari nama produk/kategori/Sub-Kategori"
    />
  );
};

const useHook = () => {
  const navigate = useNavigate();
  const columns: Columns<Product>[] = [
    {
      header: <p className="text-center">nama produk</p>,
      render: (v) => <Label label={v.name} />,
    },
    {
      header: <p className="text-center">kategori</p>,
      render: (v) => <Label label={v.categoryProduct.category.name} />,
    },
    {
      header: <p className="text-center">tanggal dibuat</p>,
      render: (v) => <Label label={epochToDateConvert(v.createdAt)} />,
    },
    {
      header: <p className="text-center">aksi</p>,
      render: (v, idx) => (
        <Actions
          action="both"
          id={idx}
          detail={{ onClick: () => navigate(`/produk/${v.id}`) }}
        />
      ),
      width: "w-40",
    },
  ];

  return { columns };
};

export default SubProduct;
