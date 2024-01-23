import { FieldValues, useForm } from "react-hook-form";
import { TableLayoutWithSearchAndTabs } from "src/components/Table";
import { Columns } from "src/types";

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
  sub: string | string[];
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
  ];

  return { categories, columns };
};
