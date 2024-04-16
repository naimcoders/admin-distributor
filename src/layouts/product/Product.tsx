import Label, { LabelPrice } from "src/components/Label";
import { TableWithSearchAndTabs } from "src/components/Table";
import { Product, useProduct } from "src/api/product.service";
import { FieldValues, useForm } from "react-hook-form";
import { Columns } from "src/types";
import { Actions } from "src/components/Actions";
import { epochToDateConvert, stringifyQuery, useSetSearch } from "src/helpers";
import { useNavigate } from "react-router-dom";
import React from "react";
import { setUser } from "src/stores/auth";

const SubProduct = ({ pageQuery, tab }: { pageQuery: string; tab: string }) => {
  const navigate = useNavigate();
  const { control, watch } = useForm<FieldValues>({ mode: "onChange" });
  const { columns } = useHook();
  const user = setUser((v) => v.user);
  const { data, isLoading, isNext, page, setSearch, setPage } =
    useProduct().find(user?.id ?? "", Number(pageQuery));

  useSetSearch(watch("search"), setSearch);

  const onNext = () => setPage((v) => v + 1);
  const onPrev = () => setPage((v) => v - 1);
  const qs = stringifyQuery({ page, tab });

  React.useEffect(() => {
    navigate(`/produk?${qs}`);
  }, [qs]);

  return (
    <TableWithSearchAndTabs
      columns={columns}
      control={control}
      isLoading={isLoading}
      data={data?.items ?? []}
      isNext={isNext}
      next={onNext}
      prev={onPrev}
      page={page}
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
      header: <p className="text-right">harga (Rp)</p>,
      render: (v) => (
        <LabelPrice product={v} label="" className="justify-end" />
      ),
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
          switch={{
            isSelected: v.isAvailable,
            onClick: () => console.log(v.isAvailable),
          }}
        />
      ),
      width: "w-40",
    },
  ];

  return { columns };
};

export default SubProduct;
