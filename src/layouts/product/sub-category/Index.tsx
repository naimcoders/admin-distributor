import Label from "src/components/Label";
import Error from "src/components/Error";
import { FieldValues, useForm } from "react-hook-form";
import { TableWithSearchAndTabs } from "src/components/Table";
import { Columns } from "src/types";
import { Category, useCategory } from "src/api/category.service";
import { Actions } from "src/components/Actions";
import { detailNavigate } from "src/helpers";

export default function CategorySub() {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { columns } = useCategorySub();
  const { data, isLoading, error } = useCategory().find();

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
}

// interface Sub {
//   id: number;
//   name: string;
// }
// interface CatergorySub {
//   id: number;
//   category: string;
//   sub: Sub[];
// }

// const categories: CatergorySub[] = [
//   {
//     id: 1,
//     category: "elektronik",
//     sub: [
//       { id: 1, name: "Naim" },
//       { id: 2, name: "Shihab" },
//     ],
//   },
// ];

const useCategorySub = () => {
  const { onNav } = detailNavigate();

  const columns: Columns<Category>[] = [
    {
      header: <p className="text-center">kategori produk</p>,
      render: (v) => <Label label={v.category.name} />,
    },
    {
      header: <p className="text-center">sub-kategori</p>,
      render: (v) => <p>{v.subCategory.map((e) => `${e.name}`).join(", ")}</p>,
    },
    {
      header: <p className="text-center">aksi</p>,
      render: (v) => (
        <Actions
          id={v.id}
          action="detail"
          detail={{
            onClick: () => onNav(`sub-kategori/${v.id}`),
          }}
        />
      ),
      width: "w-40",
    },
  ];

  return { columns };
};
