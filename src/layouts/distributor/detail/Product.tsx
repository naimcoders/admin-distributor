import { FieldValues, useForm } from "react-hook-form";
import { Actions } from "src/components/Actions";
import Label from "src/components/Label";
import { TableWithSearchAndTabs } from "src/components/Table";
import { Columns } from "src/types";

const Product = () => {
  const { control } = useForm<FieldValues>({ mode: "onChange" });

  return (
    <TableWithSearchAndTabs
      isPaginate
      columns={columns}
      data={products}
      control={control}
      isLoading={false}
      isNext={false}
      placeholder="cari nama produk, kategori, sub-kategori"
    />
  );
};

interface Product {
  id: number;
  productName: string;
  category: string;
  categorySub: string;
  price: number;
  commission: number;
  discount: string;
  period: string;
}

const products: Product[] = [
  {
    id: 1,
    productName: "Beras Kepala Lahap 5kg",
    category: "Bumbu & Bahan Makanan",
    categorySub: "Sembako",
    price: 75000,
    commission: 5,
    discount: "-",
    period: "-",
  },
  {
    id: 2,
    productName: "Kertas A4 Sidu",
    category: "Kantor & Alat Tulis",
    categorySub: "Kertas A4 Sidu",
    price: 35000,
    commission: 2,
    discount: "(5%) 1.750",
    period: "2 Des - 30 Des",
  },
];

const columns: Columns<Product>[] = [
  {
    header: "nama produk",
    render: (v) => <Label label={v.productName} />,
  },
  {
    header: "kategori",
    render: (v) => <Label label={v.category} />,
  },
  {
    header: "sub-kategori",
    render: (v) => <Label label={v.categorySub} />,
  },
  {
    header: "harga (Rp)",
    render: (v) => <Label label={v.price} className="justify-end" />,
  },
  {
    header: "komisi",
    render: (v) => <Label label={`${v.commission}%`} className="justify-end" />,
  },
  {
    header: "diskon",
    render: () => <Label label="(50%) 1.750" className="justify-end" />,
  },
  {
    header: "periode",
    render: (v) => <Label label={v.period} className="justify-center" />,
  },
  {
    header: "aksi",
    render: (v) => (
      <Actions
        id={v.id}
        action="detail"
        detail={{
          onClick: () => console.log(v.id),
        }}
      />
    ),
  },
];

export default Product;
