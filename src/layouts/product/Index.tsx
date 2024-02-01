import Tabs, { ITabs } from "src/components/Tabs";
import SubProduct from "./Product";
import { Button } from "src/components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import CategorySub from "./sub-category/Index";
import { useProduct } from "src/api/product.service";
import Error from "src/components/Error";
import { detailNavigate } from "src/helpers";

const Product = () => {
  const { error } = useProduct().find();
  const { onNav } = detailNavigate();

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : (
        <div className="relative">
          <Tabs items={tabs} color="primary" />
          <Button
            aria-label="produk"
            startContent={<PlusIcon width={16} />}
            className="absolute top-0 left-[300px]"
            onClick={() => onNav("tambah")}
          />
        </div>
      )}
    </>
  );
};

const tabs: ITabs[] = [
  { label: "produk", content: <SubProduct /> },
  { label: "sub-kategori", content: <CategorySub /> },
];

export default Product;
