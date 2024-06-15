import Tabs, { ITabs } from "src/components/Tabs";
import Profile from "./Profile";
import Business from "./Business";
import Product from "./Product";
import { parseQueryString, stringifyQuery } from "src/helpers";
import { useNavigate, useParams } from "react-router-dom";
import { useDistributor } from "src/api/distributor.service";
import React from "react";
import { getFileFromFirebase } from "src/firebase/upload";
import Skeleton from "src/components/Skeleton";

const Detail = () => {
  const [ktpFile, setKtpFile] = React.useState("");
  const navigate = useNavigate();
  const { tab } = parseQueryString<{ tab: string }>();

  const onSelectionChange = (e: React.Key) => {
    const qs = stringifyQuery({ tab: e });
    const qsWithProduct = stringifyQuery({ tab: e, page: 1 });

    if (e === "produk") navigate(`/sub-distributor/${id}?${qsWithProduct}`);
    else navigate(`/sub-distributor/${id}?${qs}`);
  };

  const { id } = useParams() as { id: string };
  const { findById } = useDistributor();
  const distributors = findById(id);

  React.useEffect(() => {
    getFileFromFirebase(distributors?.data?.documents.ktpImage ?? "").then(
      (e) => setKtpFile(e ?? "")
    );
  }, []);

  if (!distributors.data) return <Skeleton />;

  const tabs: ITabs[] = [
    {
      label: "profil",
      content: (
        <Profile
          distributorId={id}
          distributor={distributors?.data}
          error={distributors.error}
          isLoading={distributors.isLoading}
          ktp={{
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
          distributorId={id}
          distributor={distributors?.data}
          error={distributors.error}
          isLoading={distributors.isLoading}
        />
      ),
    },
    {
      label: "produk",
      content: <Product distributorId={id} />,
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
