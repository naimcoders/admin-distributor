import Tabs, { ITabs } from "src/components/Tabs";
import Profile from "./Profile";
import Customer from "./Customer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { parseQueryString, stringifyQuery } from "src/helpers";

const Detail = () => {
  const { tab } = useHook();
  const navigate = useNavigate();
  const queryString = parseQueryString<{ tab: "profil" }>();
  const { pathname } = useLocation();

  const onSelectionChange = (e: React.Key) => {
    const qsCustomer = stringifyQuery({ tab: e, page: 1 });
    const qsTab = stringifyQuery({ tab: e });

    if (e === "pelanggan") navigate(`${pathname}?${qsCustomer}`);
    else navigate(`${pathname}?${qsTab}`);
  };

  return (
    <main>
      <Tabs
        items={tab}
        color="primary"
        selectedKey={queryString.tab}
        onSelectionChange={onSelectionChange}
      />
    </main>
  );
};

const useHook = () => {
  const { id } = useParams() as { id: string };
  const tab: ITabs[] = [
    {
      label: "profil",
      content: <Profile />,
    },
    {
      label: "pelanggan",
      content: <Customer salesId={id} />,
    },
  ];

  return { tab };
};

export default Detail;
