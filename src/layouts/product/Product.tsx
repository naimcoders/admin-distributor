import { FolderOpenIcon } from "@heroicons/react/24/outline";
import { FieldValues, useForm } from "react-hook-form";
import folderIcon from "src/assets/images/folder.png";
import Image from "src/components/Image";
import { TableLayoutWithSearchAndTabs } from "src/components/Table";
import { Columns } from "src/types";

const SubProduct = () => {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  return (
    <TableLayoutWithSearchAndTabs
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
    header: "sub-kategori",
    render: (v) => <p>{v.categorySub}</p>,
  },
  {
    header: "harga (Rp)",
    render: (v) => <p className="text-right">{v.price}</p>,
  },
  {
    header: "aksi",
    render: () => (
      <div className="flex gap-4 justify-center">
        <img src={folderIcon} alt="folder" className="w-6 h-4 cursor-pointer" />
      </div>
    ),
  },
];

export default SubProduct;
