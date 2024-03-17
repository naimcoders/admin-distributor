import Error from "src/components/Error";
import Tabs, { ITabs } from "src/components/Tabs";
import CategorySub from "./sub-category/Index";
import SubProduct from "./Product";
import { Button } from "src/components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useProduct } from "src/api/product.service";
import { parseQueryString, stringifyQuery } from "src/helpers";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const navigate = useNavigate();
  const { tab, page } = parseQueryString<{ tab: string; page: string }>();
  const { error } = useProduct().find(Number(page));

  const tabs: ITabs[] = [
    { label: "produk", content: <SubProduct pageQuery={page} tab={tab} /> },
    { label: "sub-kategori", content: <CategorySub /> },
  ];

  const onSelectionChange = (e: React.Key) => {
    const qs = stringifyQuery({ tab: e, page });
    navigate(`/produk?${qs}`);
  };

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : (
        <main className="relative">
          <Tabs
            items={tabs}
            color="primary"
            selectedKey={tab}
            onSelectionChange={onSelectionChange}
          />
          <Button
            aria-label="produk"
            startContent={<PlusIcon width={16} />}
            className="absolute top-0 left-[300px]"
            onClick={() => navigate("/produk/tambah")}
          />
        </main>
      )}
    </>
  );
};

export default Product;
