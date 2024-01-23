import Tabs, { ITabs } from "src/components/Tabs";
import SubProduct from "./Product";
import { Button } from "src/components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import CategorySub from "./CategorySub";

const Product = () => {
  return (
    <div className="relative">
      <Tabs items={tabs} color="primary" />
      <Button
        aria-label="produk"
        startContent={<PlusIcon width={16} />}
        className="absolute top-0 right-0 sm:right-[42%]"
        color="primary"
      />
    </div>
  );
};

const tabs: ITabs[] = [
  { label: "produk", content: <SubProduct /> },
  { label: "sub-kategori", content: <CategorySub /> },
];

export default Product;
