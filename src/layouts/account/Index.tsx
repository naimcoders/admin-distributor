import Tabs, { ITabs } from "src/components/Tabs";
import Password from "./Password";
import Rekening from "./Rekening";
import CourierInternal from "./CourierInternal";
import { useNavigate } from "react-router-dom";
import { parseQueryString, stringifyQuery } from "src/helpers";
import Business from "./Business";

const tabs: ITabs[] = [
  { label: "email & password", content: <Password /> },
  { label: "rekening", content: <Rekening /> },
  { label: "kurir internal", content: <CourierInternal /> },
  { label: "usaha", content: <Business /> },
];

const Account = () => {
  const navigate = useNavigate();
  const { section } = parseQueryString<{ section: string }>();

  const onSelectionChange = (e: React.Key) => {
    const qs = stringifyQuery({ section: e });
    navigate(`/akun?${qs}`);
  };

  return (
    <main>
      <Tabs
        items={tabs}
        color="primary"
        selectedKey={section}
        onSelectionChange={onSelectionChange}
      />
    </main>
  );
};

export default Account;
