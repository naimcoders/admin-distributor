import { FieldValues, useForm } from "react-hook-form";
import { TableWithSearchAndTabs } from "src/components/Table";
import { Columns } from "src/types";
import { Actions } from "src/components/Actions";
import { detailNavigate } from "src/helpers";

export default function CategorySub() {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { categories, columns } = useCategorySub();

  return (
    <section>
      <TableWithSearchAndTabs
        columns={columns}
        data={categories}
        control={control}
        isLoading={false}
        placeholder="cari nama kategori, Sub-Kategori"
      />
      <div className="text-[13px] font-interMedium mt-6">
        <p>
          Tambahkan Sub-Kategori untuk setiap produk Anda untuk merapikan
          etalase dan memudahkan pencarian.
        </p>
        <p>
          Misal produk kategori Fashion, maka Sub-kategorinya bisa Fashion Pria,
          Fashion Wanita, dan lainnya.
        </p>
      </div>
    </section>
  );
}

interface CatergorySub {
  id: number;
  category: string;
  sub: string[];
}

const useCategorySub = () => {
  const { onNav } = detailNavigate();

  const categories: CatergorySub[] = [
    {
      id: 1,
      category: "elektronik",
      sub: ["Pendingin Ruangan", "Lemari Es", "Televisi"],
    },
    {
      id: 2,
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
      render: (v) => (
        <Actions
          id={v.id}
          action="detail"
          detail={{
            onClick: () => onNav(`sub-kategori/${v.id}`),
          }}
        />
      ),
    },
  ];

  return { categories, columns };
};
