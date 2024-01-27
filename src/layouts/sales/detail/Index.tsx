import Tabs, { ITabs } from "src/components/Tabs";
import Profile from "./Profile";
import Customer from "./Customer";

const Detail = () => {
  const { tab } = useHook();
  return (
    <main>
      <Tabs items={tab} color="primary" />
    </main>
  );
};

const useHook = () => {
  const tab: ITabs[] = [
    {
      label: "profil",
      content: <Profile />,
    },
    {
      label: "pelanggan",
      content: <Customer />,
    },
  ];

  return { tab };
};

export default Detail;
