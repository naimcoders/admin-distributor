import Tabs, { ITabs } from "src/components/Tabs";
import Password from "./Password";
import Rekening from "./Rekening";

const Account = () => {
  return (
    <main>
      <Tabs items={tabs} color="primary" />
    </main>
  );
};

const tabs: ITabs[] = [
  { label: "password", content: <Password /> },
  { label: "rekening", content: <Rekening /> },
];

export default Account;
