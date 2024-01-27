import Tabs, { ITabs } from "src/components/Tabs";
import Profile from "./Profile";
import Business from "./Business";

const Detail = () => {
  const { tabs } = useHook();

  return (
    <main>
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
  ];

  return { tabs };
};

export default Detail;
