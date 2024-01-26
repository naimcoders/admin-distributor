import Tabs, { ITabs } from "src/components/Tabs";
import Profile from "./Profile";

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
      content: <p>pelanggan</p>,
    },
  ];

  return { tab };
};

export default Detail;
