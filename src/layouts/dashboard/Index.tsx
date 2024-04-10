import { Button } from "src/components/Button";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { Columns } from "src/types";
import { useActiveModal } from "src/stores/modalStore";
import { Currency } from "src/helpers";
import { findMeWallet } from "src/api/pilipay.service";
import withdrawLogo from "src/assets/images/withdraw.png";
import walletSVG from "src/assets/svg/wallet-fill.svg";
import transferImg from "src/assets/images/transfer.png";
import topUpImg from "src/assets/images/top up.png";
import historyImg from "src/assets/images/riwayat.png";
import cx from "classnames";
import Label from "src/components/Label";
import Table from "src/components/Table";
import Image from "src/components/Image";
import History from "./modals/History";
import Transfer from "./modals/Transfer";
import Topup from "./modals/Topup";
import React, { FC } from "react";
import ActivatedPilipay from "./modals/Activated";
import { formatRupiah } from "src/helpers/idr";
import { findtotalProduct } from "src/api/product.service";
import { findTotalSubDistributor } from "src/api/distributor.service";

const Dashboard = () => {
  return (
    <>
      <main className="flex flex-col gap-8">
        <TopLine />
        <MiddleLine />
        <BottomLine />
      </main>
    </>
  );
};

// interface ITopLines {
//   label: string;
//   amount: number;
//   bg: { topLeft: string; bottomRight: string };
// }

// const arrTopLines: ITopLines[] = [
//   {
//     label: "total produk",
//     amount: 1457,
//     bg: { topLeft: "from-[#fcd78c]", bottomRight: "to-[#f48b84]" },
//   },
//   {
//     label: "total toko",
//     amount: 579,
//     bg: { topLeft: "from-[#fc8194]", bottomRight: "to-[#f44fa4]" },
//   },
//   {
//     label: "total sales",
//     amount: 138,
//     bg: { topLeft: "from-[#984acc]", bottomRight: "to-[#3d2bac]" },
//   },
//   {
//     label: "total distributor",
//     amount: 12,
//     bg: { topLeft: "from-[#23d8dc]", bottomRight: "to-[#5687e9]" },
//   },
// ];

const TotalData: FC<{ data?: number; title: string; gradient: string }> = ({
  gradient,
  data,
  title,
}) => (
  <Card
    className={cx(
      "bg-gradient-to-r text-white flex-grow lg:flex-1 z-0 px-1",
      gradient
    )}
  >
    <CardHeader className="capitalize text-xl" as="h2">
      {title}
    </CardHeader>
    <CardBody as="h2" className="text-5xl font-interMedium text-center -mt-4">
      {data === undefined && <Spinner />}
      {data && data.toLocaleString("id-ID")}
    </CardBody>
  </Card>
);

const TotalProduct = () => {
  const data = findtotalProduct();
  return (
    <TotalData
      title="total produk"
      gradient="from-[#fcd78c] to-[#f48b84]"
      data={data.data}
    />
  );
};

const TotalSubDistributor = () => {
  const data = findTotalSubDistributor();
  return (
    <TotalData
      title="total distributor"
      gradient="from-[#23d8dc] to-[#5687e9]"
      data={data.data}
    />
  );
};

const TotalStore = () => {
  return (
    <TotalData
      title="total toko"
      gradient="from-[#fc8194] to-[#f44fa4]"
      data={0}
    />
  );
};

const TotalSales = () => {
  return (
    <TotalData
      title="total sales"
      gradient="from-[#984acc] to-[#3d2bac]"
      data={0}
    />
  );
};

const TopLine = () => {
  return (
    <section className="grid-min-300 lg:gap-8">
      <TotalProduct />
      <TotalStore />
      <TotalSales />
      <TotalSubDistributor />
    </section>
  );
};

const MiddleLine = () => {
  return (
    <section className="grid-min-300 gap-8">
      <PiliPay />

      <Card className="z-0 px-1 bg-gradient-to-b from-[#f1f1f1] to-[#b9b7b7]">
        <CardHeader as="h2" className="text-lg capitalize justify-center">
          total omset
        </CardHeader>
        <CardBody as="h2" className="font-interBold text-xl text-center -mt-4">
          Rp18,950,000
        </CardBody>
      </Card>
      <Card className="z-0 px-1 bg-gradient-to-b from-[#f1f1f1] to-[#b9b7b7]">
        <CardHeader as="h2" className="text-lg capitalize justify-center">
          total transaksi
        </CardHeader>
        <CardBody as="h2" className="font-interBold text-xl text-center -mt-4">
          Rp17,829
        </CardBody>
      </Card>
    </section>
  );
};

const PiliPay = () => {
  return (
    <section className="bg-primary px-4 py-6 rounded-xl flex gap-4 shadow-md md:col-span-2 whitespace-nowrap overflow-auto flex-grow">
      <PilipayTransaction />
      <div className="w-[.11rem] h-full bg-white opacity-[.4] rounded-md" />
      <PilipayBalance />
    </section>
  );
};

const PilipayTransaction = () => {
  return (
    <section className="flex items-center gap-4 flex-1">
      <div className="text-white flex flex-col gap-2">
        <h2 className="capitalize text-[.75rem]">transaksi hari ini</h2>
        <h2 className="font-interMedium">Rp1.978.000</h2>
      </div>
      <Button
        aria-label="Update"
        radius="sm"
        className="w-full text-black text-sm bg-blue-300 font-semibold"
      />
    </section>
  );
};

// PILIPAY
const PilipayBalance = () => {
  const [isActivated, setIsActivated] = React.useState(false);
  const { actionIsHistory, actionIsTransfer, actionIsTopUp } = useActiveModal();

  const payments: { label: string; src: string; onClick?: () => void }[] = [
    { label: "riwayat", src: historyImg, onClick: actionIsHistory },
    { label: "top up", src: topUpImg, onClick: actionIsTopUp },
    { label: "transfer", src: transferImg, onClick: actionIsTransfer },
    { label: "withdraw", src: withdrawLogo },
  ];

  const { data } = findMeWallet(true);

  return (
    <>
      {isActivated && (
        <ActivatedPilipay isOpen={isActivated} setOpen={setIsActivated} />
      )}
      <section className="flex gap-10 items-center">
        <section className="text-white flex flex-col gap-2">
          <span className="text-[.75rem] tracking-wider inline-flex gap-1">
            <img src={walletSVG} alt="wallet" className="w-4" />
            Saldo PiliPay
          </span>
          <h2 className="font-interMedium text-sm">
            {formatRupiah(data?.balance ?? 0)}
          </h2>
        </section>

        {!data?.id ? (
          <Button
            aria-label="aktifkan"
            className="w-full text-black text-sm bg-blue-300 font-semibold"
            onClick={() => setIsActivated(true)}
          />
        ) : (
          <section className="flex gap-3">
            {payments.map((v) => (
              <BtnPiliPayActions
                label={v.label}
                alt={v.label}
                src={v.src}
                onClick={v.onClick}
                key={v.label}
              />
            ))}
          </section>
        )}

        <History />
        <Transfer />
        <Topup />
      </section>
    </>
  );
};

interface PiliPayActions {
  label: string;
  src: string;
  alt: string;
  onClick?: () => void;
}

const BtnPiliPayActions = ({ label, src, alt, onClick }: PiliPayActions) => {
  return (
    <section
      className="flexcol gap-1 items-center cursor-pointer"
      onClick={onClick}
    >
      <Image src={src} alt={alt} width={20} radius="none" />
      <h2 className="text-xs text-white capitalize">{label}</h2>
    </section>
  );
};

// ======

const BottomLine = () => {
  return (
    <footer className="flex flex-col gap-8 sm:flex-row sm:flex-wrap">
      <Table
        columns={columnStore}
        data={stores}
        isLoading={false}
        isTransparent
        className="flex-1"
      />

      <Table
        columns={columnProduct}
        data={products}
        isLoading={false}
        isTransparent
        className="flex-1"
      />
    </footer>
  );
};

interface Store {
  bestStore: string;
  omset: number;
  transaction: number;
}

interface Product {
  bestStore: string;
  category: string;
  totalPay: number;
}

const stores: Store[] = [
  {
    bestStore: "Sukses Jaya Mandiri",
    omset: 21311442,
    transaction: 1231,
  },
  {
    bestStore: "Sukses Jaya Mandiri",
    omset: 21311442,
    transaction: 1231,
  },
];

const products: Product[] = [
  {
    bestStore: "Kertas A4 1 Rim",
    category: "Kantor & Alat Tulis",
    totalPay: 532,
  },
  {
    bestStore: "Sukses Jaya Mandiri",
    category: "Bahan Bangunan",
    totalPay: 513,
  },
];

const columnStore: Columns<Store>[] = [
  {
    header: <p className="text-[#30b2e5] text-sm">toko terlaris</p>,
    render: (v, idx) => <Label label={`${idx + 1}. ${v.bestStore}`} />,
  },
  {
    header: (
      <p className="text-right text-[#30b2e5] text-sm">total omset (Rp)</p>
    ),
    render: (v) => <Label label={Currency(v.omset)} className="justify-end" />,
  },
  {
    header: (
      <p className="text-right text-[#30b2e5] text-sm">total transaksi</p>
    ),
    render: (v) => (
      <Label label={Currency(v.transaction)} className="justify-end" />
    ),
  },
];

const columnProduct: Columns<Product>[] = [
  {
    header: <p className="text-[#ae5eaa] text-sm">produk terlaris</p>,
    render: (v, idx) => <Label label={`${idx + 1}. ${v.bestStore}`} />,
  },
  {
    header: <p className="text-[#ae5eaa] text-sm">kategori</p>,
    render: (v) => <Label label={v.category} />,
  },
  {
    header: (
      <p className="text-right text-[#ae5eaa] text-sm">total pembelian</p>
    ),
    render: (v) => (
      <Label label={Currency(v.totalPay)} className="justify-end" />
    ),
  },
];

export default Dashboard;
