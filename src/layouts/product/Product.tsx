import { FieldValues, useForm } from "react-hook-form";
import { Actions } from "src/components/Actions";
import Label from "src/components/Label";
import { TableWithSearchAndTabs } from "src/components/Table";
import { Currency } from "src/helpers";
import { Columns } from "src/types";

const SubProduct = () => {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { columns } = useProduct();

  return (
    <TableWithSearchAndTabs
      isPaginate
      columns={columns}
      data={products}
      control={control}
      isLoading={false}
      placeholder="cari nama produk/kategori/Sub-Kategori"
    />
  );
};

interface Product {
  productName: string;
  category: string;
  categorySub: string;
  price: number;
}

const products: Product[] = [
  {
    productName: "Beras Kelapa Lahap 5kg",
    category: "Bumbu & Bahan Makanan",
    categorySub: "Sembako",
    price: 75000,
  },
  {
    productName: "Kertas A4 Sidu",
    category: "Kantor & Alat Tulis",
    categorySub: "Kertas A4 Sidu",
    price: 35000,
  },
];

const useProduct = () => {
  const columns: Columns<Product>[] = [
    {
      header: <p className="text-center">nama produk</p>,
      render: (v) => <Label label={v.productName} />,
    },
    {
      header: <p className="text-center">kategori</p>,
      render: (v) => <Label label={v.category} />,
    },
    {
      header: <p className="text-center">sub-kategori</p>,
      render: (v) => <Label label={v.categorySub} />,
    },
    {
      header: <p className="text-right">harga (Rp)</p>,
      render: (v) => (
        <Label label={Currency(v.price)} className="justify-end" />
      ),
    },
    {
      header: <p className="text-center">aksi</p>,
      render: (_, idx) => <Actions action="both" id={idx} />,
      width: "w-40",
    },
  ];

  return { columns };
};

export default SubProduct;
