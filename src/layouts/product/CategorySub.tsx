import { FieldValues, useForm } from "react-hook-form";
import { TableWithSearchAndTabs } from "src/components/Table";
import { Columns } from "src/types";
import { ImageFolder } from "src/components/Image";

export default function CategorySub() {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { categories, columns } = useCategorySub();

  return (
    <TableWithSearchAndTabs
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
      category: "Gadget & Aksesoris",
      sub: ["Handphone", "Tablet", "Casing", "Charger"],
    },
  ];

  const columns: Columns<CatergorySub>[] = [
    { header: "kategori produk", render: (v) => <p>{v.category}</p> },
    {
      header: "sub kategori",
      render: (v) => <ul className="flex">{v.sub.join(", ")}</ul>,
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
