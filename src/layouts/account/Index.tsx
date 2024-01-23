import Tabs, { ITabs } from "src/components/Tabs";
import Password from "./Password";

const Account = () => {
  return (
    <main>
      <Tabs items={tabs} color="primary" />
    </main>
  );
};

const tabs: ITabs[] = [
  { label: "password", content: <Password /> },
  { label: "rekening", content: <h1>rekening</h1> },
];

export default Account;
