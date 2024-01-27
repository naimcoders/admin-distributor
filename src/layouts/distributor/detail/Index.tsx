import Tabs, { ITabs } from "src/components/Tabs";
import Profile from "./Profile";
import Business from "./Business";
import Product from "./Product";

const Detail = () => {
  const { tabs } = useHook();

  return (
    <main className="relative">
      <Tabs color="primary" items={tabs} />
    </main>
  );
};

const useHook = () => {
  const tabs: ITabs[] = [
    {
      label: "profil",
      content: <Profile />,
    },
    {
      label: "usaha",
      content: <Business />,
    },
    {
      label: "produk",
      content: <Product />,
    },
  ];

  return { tabs };
};

export default Detail;
