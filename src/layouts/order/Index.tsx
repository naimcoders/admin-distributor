import Tabs from "src/components/Tabs";
import Waiting from "./waiting/Index";
import Process from "./process/Index";
import Finish from "./finish/Index";
import Cancel from "./cancel/Index";

const Order = () => {
  const { tabs } = useTabs();
  return (
    <main className="relative">
      <Tabs color="primary" items={tabs} />
    </main>
  );
};

const useTabs = () => {
  const tabs = [
    {
      label: "menunggu",
      content: <Waiting />,
    },
    {
      label: "diproses",
      content: <Process />,
    },
    {
      label: "selesai",
      content: <Finish />,
    },
    {
      label: "batal",
      content: <Cancel />,
    },
  ];

  return { tabs };
};

export default Order;
