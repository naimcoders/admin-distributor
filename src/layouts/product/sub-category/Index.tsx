import Error from "src/components/Error";
import { FieldValues, useForm } from "react-hook-form";
import { TableWithSearchAndTabs } from "src/components/Table";
import { Columns } from "src/types";
import { Actions } from "src/components/Actions";
import {
  ProductCategory,
  useProductCategory,
} from "src/api/product-category.service";
import { useNavigate } from "react-router-dom";

const CategorySub = () => {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { columns } = useCategorySub();
  const { find } = useProductCategory();
  const { data, error, isLoading } = find();

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : (
        <section>
          <TableWithSearchAndTabs
            columns={columns}
            data={data ?? []}
            control={control}
            isLoading={isLoading}
            placeholder="cari nama kategori/Sub-Kategori"
          />
          <div className="text-[13px] mt-6 normal-case">
            <p>
              Tambahkan sub-kategori untuk setiap produk Anda untuk merapikan
              etalase dan memudahkan pencarian.
            </p>
            <p>
              Misal produk kategori fashion, maka sub-kategorinya bisa fashion
              pria, fashion wanita, dan lainnya.
            </p>
          </div>
        </section>
      )}
    </>
  );
};

const useCategorySub = () => {
  const navigate = useNavigate();

  const columns: Columns<ProductCategory>[] = [
    {
      header: <p className="text-center">kategori produk</p>,
      render: (v) => <p className="truncate">{v.category.name}</p>,
    },
    {
      header: <p className="text-center">sub-kategori</p>,
      render: (v) =>
        v.subCategory.length < 1 ? (
          <p className="text-gray-400 cursor-default font-bold">-</p>
        ) : (
          <p className="truncate normal-case">
            {v.subCategory.map((e) => e.name).join(", ")}
          </p>
        ),
    },
    {
      header: <p className="text-center">aksi</p>,
      render: (v) => (
        <Actions
          id={v.id}
          action="detail"
          detail={{
            onClick: () =>
              navigate(`/produk/sub-kategori/${v.category.name}/${v.id}`),
          }}
        />
      ),
      width: "w-40",
    },
  ];

  return { columns };
};

export default CategorySub;
