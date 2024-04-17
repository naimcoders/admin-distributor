import Tabs, { ITabs } from "src/components/Tabs";
import Password from "./Password";
import Rekening from "./Rekening";
import CourierInternal from "./CourierInternal";

const tabs: ITabs[] = [
  { label: "password", content: <Password /> },
  { label: "rekening", content: <Rekening /> },
  { label: "kurir internal", content: <CourierInternal /> },
];

const Account = () => {
  return (
    <main>
      <Tabs items={tabs} color="primary" />
    </main>
  );
};

export default Account;
