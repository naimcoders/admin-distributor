import plus from "src/assets/svg/plus.svg";
import walletSVG from "src/assets/svg/wallet-fill.svg";
import arrowExchange from "src/assets/svg/arrow-exchange.svg";
import cx from "classnames";
import { Button } from "src/components/Button";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Columns } from "src/types";
import Table from "src/components/Table";

const Dashboard = () => {
  return (
    <main className="flex flex-col gap-8">
      <TopLine />
      <MiddleLine />
      <BottomLine />
    </main>
  );
};

interface ITopLines {
  label: string;
  amount: number;
  bg: { topLeft: string; bottomRight: string };
}

const arrTopLines: ITopLines[] = [
  {
    label: "total produk",
    amount: 1457,
    bg: { topLeft: "from-[#fcd78c]", bottomRight: "to-[#f48b84]" },
  },
  {
    label: "total toko",
    amount: 579,
    bg: { topLeft: "from-[#fc8194]", bottomRight: "to-[#f44fa4]" },
  },
  {
    label: "total sales",
    amount: 138,
    bg: { topLeft: "from-[#984acc]", bottomRight: "to-[#3d2bac]" },
  },
  {
    label: "total distributor",
    amount: 12,
    bg: { topLeft: "from-[#23d8dc]", bottomRight: "to-[#5687e9]" },
  },
];

const TopLine = () => {
  return (
    <section className="flex flex-wrap gap-4 lg:gap-8">
      {arrTopLines.map((v) => (
        <Card
          key={v.label}
          className={cx(
            "bg-gradient-to-r text-white flex-grow lg:flex-1 z-0",
            `${v.bg.topLeft} ${v.bg.bottomRight}`
          )}
        >
          <CardHeader className="capitalize" as="h2">
            {v.label}
          </CardHeader>
          <CardBody as="h2" className="text-3xl font-interMedium text-center">
            {v.amount}
          </CardBody>
        </Card>
      ))}
    </section>
  );
};

const MiddleLine = () => {
  return (
    <section className="flex flex-wrap gap-8">
      <PiliPay />

      <Card className="flex-grow z-0">
        <CardHeader as="h2" className="text-sm capitalize font-interMedium">
          total omset
        </CardHeader>
        <CardBody as="h2" className="font-interBold text-xl text-center">
          Rp18,950,000
        </CardBody>
      </Card>
      <Card className="flex-grow">
        <CardHeader as="h2" className="text-sm capitalize font-interMedium">
          total transaksi
        </CardHeader>
        <CardBody as="h2" className="font-interBold text-xl text-center">
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
      <div className="text-white flex flex-col gap-1">
        <h2 className="capitalize text-[.72rem]">transaksi hari ini</h2>
        <h2 className="font-interMedium">Rp1.978.000</h2>
      </div>
      <Button
        aria-label="Update"
        radius="sm"
        className="w-full text-black text-xs bg-blue-300 font-interBold"
      />
    </section>
  );
};

const PilipayBalance = () => {
  return (
    <section className="flex gap-4 items-center">
      <section className="text-white flex flex-col gap-1">
        <span className="text-[.72rem] tracking-wider inline-flex gap-1">
          <img src={walletSVG} alt="wallet" className="w-4" />
          Saldo PiliPay
        </span>
        <h2 className="font-interMedium">Rp13.450.000</h2>
      </section>

      <section className="flex gap-4">
        <BtnTopUpAndTransfer
          label="top up"
          srcImgIcon={plus}
          onClick={() => console.log("top up")}
        />
        <BtnTopUpAndTransfer
          label="transfer"
          srcImgIcon={arrowExchange}
          onClick={() => console.log("transfer")}
        />
      </section>
    </section>
  );
};

interface TopUpAndTransfer {
  label: string;
  srcImgIcon: string;
  onClick?: () => void;
}

const BtnTopUpAndTransfer = ({
  label,
  srcImgIcon,
  onClick,
}: TopUpAndTransfer) => {
  return (
    <button
      className="capitalize inline-flex text-[.70rem] text-white flex-col items-center gap-1 tracking-wide remove-highlight"
      onClick={onClick}
    >
      <img
        src={srcImgIcon}
        alt={label}
        className="bg-blue-300 rounded-md w-5 p-[.15rem]"
      />
      {label}
    </button>
  );
};

const BottomLine = () => {
  return (
    <footer className="flex flex-col gap-8 sm:flex-row sm:flex-wrap">
      <Table
        columns={columns}
        data={stores}
        isLoading={false}
        isTransparent
        className="flex-1"
        textColorHead="text-[#30b2e5]"
      />

      <Table
        columns={columns}
        data={stores}
        isLoading={false}
        isTransparent
        className="flex-1"
        textColorHead="text-[#ae5eaa]"
      />
    </footer>
  );
};

interface Store {
  bestStore: string;
  renevue: number;
  transaction: number;
}

const stores: Store[] = [
  {
    bestStore: "sukses jaya mandiri",
    renevue: 21311442,
    transaction: 1231,
  },
  {
    bestStore: "sukses jaya mandiri",
    renevue: 21311442,
    transaction: 1231,
  },
];

const columns: Columns<Store>[] = [
  {
    header: "toko terlaris",
    render: (v, idx) => (
      <p>
        {idx + 1}. {v.bestStore}
      </p>
    ),
  },
  {
    header: "total revenue",
    render: (v) => <p className="text-center">{v.renevue}</p>,
  },
  {
    header: "total transaksi",
    render: (v) => <p className="text-center">{v.transaction}</p>,
  },
];

export default Dashboard;
