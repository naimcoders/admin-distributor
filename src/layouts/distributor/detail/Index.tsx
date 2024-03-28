import Tabs, { ITabs } from "src/components/Tabs";
import Profile from "./Profile";
import Business from "./Business";
import Product from "./Product";
import { parseQueryString, stringifyQuery } from "src/helpers";
import { useNavigate, useParams } from "react-router-dom";
import { useDistributor } from "src/api/distributor.service";
import React from "react";
import { getFile } from "src/firebase/upload";
import Skeleton from "src/components/Skeleton";

const Detail = () => {
  const [ktpFile, setKtpFile] = React.useState("");
  const navigate = useNavigate();
  const { tab } = parseQueryString<{ tab: string }>();

  const onSelectionChange = (e: React.Key) => {
    const qs = stringifyQuery({ tab: e });
    navigate(`/sub-distributor/${id}?${qs}`);
  };

  const { id } = useParams() as { id: string };
  const { findById } = useDistributor();
  const distributors = findById(id);

  getFile(distributors?.data?.documents.ktpImage ?? "", setKtpFile);
  if (!distributors.data) return <Skeleton />;

  const tabs: ITabs[] = [
    {
      label: "profil",
      content: (
        <Profile
          distributor={distributors?.data}
          error={distributors.error}
          isLoading={distributors.isLoading}
          ktpFile={{
            file: ktpFile,
            setFile: setKtpFile,
          }}
        />
      ),
    },
    {
      label: "usaha",
      content: (
        <Business
          distributor={distributors?.data}
          error={distributors.error}
          isLoading={distributors.isLoading}
        />
      ),
    },
    {
      label: "produk",
      content: <Product />,
    },
  ];

  return (
    <main className="relative">
      <Tabs
        color="primary"
        items={tabs}
        selectedKey={tab}
        onSelectionChange={onSelectionChange}
      />
    </main>
  );
};

export default Detail;
