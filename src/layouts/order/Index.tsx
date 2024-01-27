import Tabs, { ITabs } from "src/components/Tabs";
import Waiting from "./waiting/Index";
import Process from "./process/Index";

const Order = () => {
  const { tabs } = useTabs();
  return (
    <main className="relative">
      <Tabs color="primary" items={tabs} />
    </main>
  );
};

export default Order;

const useTabs = () => {
  const tabs: ITabs[] = [
    {
      label: "menunggu",
      content: <Waiting />,
    },
    {
      label: "diproses",
      content: <Process />,
    },
  ];

  return { tabs };
};
