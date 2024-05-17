import Error from "src/components/Error";
import Tabs, { ITabs } from "src/components/Tabs";
import CategorySub from "./sub-category/Index";
import SubProduct from "./Product";
import { Button } from "src/components/Button";
import { HiOutlinePlus } from "react-icons/hi2";
import { useProduct } from "src/api/product.service";
import { parseQueryString, stringifyQuery } from "src/helpers";
import { useNavigate } from "react-router-dom";
import { setUser } from "src/stores/auth";

const Product = () => {
  const navigate = useNavigate();
  const { tab, page } = parseQueryString<{ tab: string; page: string }>();
  const user = setUser((v) => v.user);
  const { find } = useProduct();
  const { error } = find(user?.id ?? "", Number(page));

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
        <main className="relative overflow-auto whitespace-nowrap">
          <Tabs
            items={tabs}
            color="primary"
            selectedKey={tab}
            onSelectionChange={onSelectionChange}
          />
          <Button
            label="produk"
            startContent={<HiOutlinePlus size={16} />}
            className="absolute top-0 left-[300px]"
            onClick={() => navigate("/produk/tambah")}
          />
        </main>
      )}
    </>
  );
};

export default Product;
