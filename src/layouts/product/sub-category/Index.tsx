import { FieldValues, useForm } from "react-hook-form";
import { TableWithSearchAndTabs } from "src/components/Table";
import { Columns } from "src/types";
import { Actions } from "src/components/Actions";
import { detailNavigate } from "src/helpers";
import Label from "src/components/Label";

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
        placeholder="cari nama kategori/Sub-Kategori"
      />
      <div className="text-[13px] mt-6 normal-case">
        <p>
          Tambahkan sub-kategori untuk setiap produk Anda untuk merapikan
          etalase dan memudahkan pencarian.
        </p>
        <p>
          Misal produk kategori fashion, maka sub-kategorinya bisa fashion pria,
          fashion wanita, dan lainnya.
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
    {
      header: <p className="text-center">kategori produk</p>,
      render: (v) => <Label label={v.category} />,
    },
    {
      header: <p className="text-center">sub-kategori</p>,
      render: (v) => (
        <ul className="flex font-interMedium">{v.sub.join(", ")}</ul>
      ),
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

  return { categories, columns };
};
