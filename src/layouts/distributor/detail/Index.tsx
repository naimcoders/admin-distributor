import Tabs, { ITabs } from "src/components/Tabs";
import Profile from "./Profile";
import Business from "./Business";
import Product from "./Product";
import { parseQueryString, stringifyQuery } from "src/helpers";
import { useNavigate, useParams } from "react-router-dom";
import { useDistributor } from "src/api/distributor.service";

const Detail = () => {
  const { tabs } = useHook();
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };

  const { tab } = parseQueryString<{ tab: string }>();
  const onSelectionChange = (e: React.Key) => {
    const qs = stringifyQuery({ tab: e });
    navigate(`/distributor/${id}?${qs}`);
  };

  return (
    <main className="relative">
      <Tabs
        color="primary"
        items={tabs}
        selectedKey={tab}
        onSelectionChange={onSelectionChange}
      />
    </main>
  );
};

const useHook = () => {
  const { id } = useParams() as { id: string };
  const { findById } = useDistributor();
  const distributors = findById(id);

  const tabs: ITabs[] = [
    {
      label: "profil",
      content: (
        <Profile
          distributor={distributors?.data}
          error={distributors.error}
          isLoading={distributors.isLoading}
        />
      ),
    },
    {
      label: "usaha",
      content: (
        <Business
          distributor={distributors?.data}
          error={distributors.error}
          isLoading={distributors.isLoading}
        />
      ),
    },
    {
      label: "produk",
      content: <Product />,
    },
  ];

  return { tabs };
};

export default Detail;
