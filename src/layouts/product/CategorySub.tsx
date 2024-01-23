import { FieldValues, useForm } from "react-hook-form";
import { TableLayoutWithSearchAndTabs } from "src/components/Table";
import { Columns } from "src/types";
import { ImageFolder } from "src/components/Image";

export default function CategorySub() {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { categories, columns } = useCategorySub();

  return (
    <TableLayoutWithSearchAndTabs
      columns={columns}
      data={categories}
      control={control}
      isLoading={false}
      placeholder="cari nama kategori, Sub-Kategori"
    />
  );
}

interface CatergorySub {
  category: string;
  sub: string[];
}

const useCategorySub = () => {
  const categories: CatergorySub[] = [
    {
      category: "elektronik",
      sub: ["Pendingin Ruangan", "Lemari Es", "Televisi"],
    },
    {
      category: "elektronik",
      sub: ["Pendingin Ruangan", "Lemari Es", "Televisi"],
    },
  ];

  const columns: Columns<CatergorySub>[] = [
    { header: "kategori produk", render: (v) => <p>{v.category}</p> },
    {
      header: "sub kategori",
      render: (v) => (
        <ul className="flex">
          {v.sub.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      ),
    },
    {
      header: "aksi",
      render: () => (
        <ImageFolder onClick={() => console.log("hello")} className="mx-auto" />
      ),
    },
  ];

  return { categories, columns };
};
