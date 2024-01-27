import { FieldValues, useForm } from "react-hook-form";
import { Actions } from "src/components/Actions";
import { TableWithSearchAndTabs } from "src/components/Table";
import { Columns } from "src/types";

const SubProduct = () => {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { columns } = useProduct();

  return (
    <TableWithSearchAndTabs
      columns={columns}
      data={products}
      control={control}
      isLoading={false}
      placeholder="cari nama produk, kategori, Sub-Kategori"
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
      header: "nama produk",
      render: (v) => <p>{v.productName}</p>,
    },
    {
      header: "kategori",
      render: (v) => <p>{v.category}</p>,
    },
    {
      header: "sub kategori",
      render: (v) => <p>{v.categorySub}</p>,
    },
    {
      header: "harga (Rp)",
      render: (v) => <p className="text-right">{v.price}</p>,
    },
    {
      header: "aksi",
      render: (_, idx) => <Actions action="both" id={idx} />,
    },
  ];

  return { columns };
};

export default SubProduct;
