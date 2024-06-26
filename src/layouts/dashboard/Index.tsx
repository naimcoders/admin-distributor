import { Button } from "src/components/Button";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { Columns } from "src/types";
import { useActiveModal } from "src/stores/modalStore";
import { Currency, setHoursEpochTime } from "src/helpers";
import { findMeWallet } from "src/api/pilipay.service";
import withdrawLogo from "src/assets/images/withdraw.png";
import walletSVG from "src/assets/svg/wallet-fill.svg";
import transferImg from "src/assets/images/transfer.png";
import topUpImg from "src/assets/images/top up.png";
import historyImg from "src/assets/images/riwayat.png";
import cx from "classnames";
import Table from "src/components/Table";
import Image from "src/components/Image";
import History from "./modals/History";
import Transfer from "./modals/Transfer";
import Topup from "./modals/Topup";
import React from "react";
import ActivatedPilipay from "./modals/Activated";
import {
  ProductBestSelling,
  findtotalProduct,
  productBestSelling,
} from "src/api/product.service";
import { findTotalSubDistributor } from "src/api/distributor.service";
import {
  Buyers,
  findBuyers,
  findOrderCount,
  findRevenue,
} from "src/api/performance.service";
import Error from "src/components/Error";
import { setUser } from "src/stores/auth";
import Withdraw from "./modals/Withdraw";

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

const TotalData: React.FC<{
  data?: number;
  title: string;
  gradient: string;
}> = ({ gradient, data, title }) => (
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
      title="total sub-distributor"
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
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 md:gap-6 lg:gap-8">
      <TotalProduct />
      <TotalStore />
      <TotalSales />
      <TotalSubDistributor />
    </section>
  );
};

const MiddleLine = () => {
  const orders = findOrderCount();
  const user = setUser((v) => v.user);
  const endAt = setHoursEpochTime(23, 59);
  const revenue = findRevenue(user?.createdAt ?? 0, endAt);

  return (
    <section className="grid lg:grid-cols-4 lg:gap-8 md:gap-6 gap-4">
      <PiliPay />

      <Card className="z-0 px-1 bg-gradient-to-b from-[#f1f1f1] to-[#b9b7b7]">
        <CardHeader as="h2" className="text-lg capitalize justify-center">
          total omset
        </CardHeader>
        {revenue.error ? (
          <h2 className="text-red-200">Error</h2>
        ) : revenue.isLoading ? (
          <Spinner size="sm" />
        ) : (
          <CardBody as="h2" className="font-bold text-xl text-center -mt-4">
            Rp{Currency(revenue.data ?? 0)}
          </CardBody>
        )}
      </Card>

      <Card className="z-0 px-1 bg-gradient-to-b from-[#f1f1f1] to-[#b9b7b7]">
        <CardHeader as="h2" className="text-lg capitalize justify-center">
          total transaksi
        </CardHeader>
        {orders.error ? (
          <h2 className="text-red-200">Error</h2>
        ) : orders.isLoading ? (
          <Spinner size="sm" />
        ) : (
          <CardBody as="h2" className="font-bold text-xl text-center -mt-4">
            {Currency(orders.data ?? 0)}
          </CardBody>
        )}
      </Card>
    </section>
  );
};

const PiliPay = () => {
  return (
    <section className="bg-primary px-4 py-6 rounded-xl flex gap-4 shadow-md md:col-span-2 whitespace-nowrap overflow-auto flex-grow">
      <PilipayTransaction />
      <PilipayBalance />
    </section>
  );
};

const PilipayTransaction = () => {
  const startAt = setHoursEpochTime(12, 1);
  const endAt = setHoursEpochTime(23, 59);
  const { data, isLoading, error } = findRevenue(startAt, endAt);

  return (
    <section className="flex items-center gap-3 flex-1">
      <div className="text-white flex flex-col gap-2">
        <h2 className="capitalize text-[.75rem]">transaksi hari ini</h2>
        {error ? (
          <h2 className="text-red-200">Error</h2>
        ) : isLoading ? (
          <Spinner color="secondary" size="sm" />
        ) : (
          <h2 className="font-medium">Rp{data}</h2>
        )}
      </div>
      <Button
        label="update"
        radius="sm"
        className="w-full text-black text-sm bg-blue-300 font-semibold"
      />
    </section>
  );
};

// PILIPAY
const PilipayBalance = () => {
  const [isActivated, setIsActivated] = React.useState(false);
  const { actionIsHistory, actionIsTransfer, actionIsTopUp, actionIsWithdraw } =
    useActiveModal();

  const payments: { label: string; src: string; onClick?: () => void }[] = [
    { label: "riwayat", src: historyImg, onClick: actionIsHistory },
    { label: "top up", src: topUpImg, onClick: actionIsTopUp },
    { label: "transfer", src: transferImg, onClick: actionIsTransfer },
    { label: "withdraw", src: withdrawLogo, onClick: actionIsWithdraw },
  ];

  const { data } = findMeWallet(true);

  return (
    <>
      {isActivated && (
        <ActivatedPilipay isOpen={isActivated} setOpen={setIsActivated} />
      )}
      <section className="flex gap-8 lg:gap-4 items-center">
        <section className="text-white flex flex-col gap-2">
          <span className="text-[.75rem] tracking-wider inline-flex gap-1">
            <img src={walletSVG} alt="wallet" className="w-4" />
            Saldo PiliPay
          </span>
          <h2 className="font-medium">Rp{Currency(data?.balance ?? 0)}</h2>
        </section>

        {!data?.id ? (
          <Button
            label="aktifkan"
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
        <Withdraw />
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
      className="flex flex-col gap-1 items-center cursor-pointer"
      onClick={onClick}
    >
      <Image src={src} alt={alt} width={20} radius="none" />
      <h2 className="text-xs text-white capitalize">{label}</h2>
    </section>
  );
};

const BottomLine = () => {
  const stores = findBuyers();
  const products = productBestSelling();

  return (
    <footer className="grid lg:grid-cols-2 grid-cols-1 lg:gap-8 gap-4">
      {stores.error ? (
        <Error error={stores.error} />
      ) : (
        <Table
          columns={columnStore}
          data={stores.data ?? []}
          isLoading={stores.isLoading}
          className="overflow-y-auto whitespace-nowrap h-calcDashboardTable"
        />
      )}

      {products.error ? (
        <Error error={products.error} />
      ) : (
        <Table
          columns={columnProduct}
          data={products.data ?? []}
          isLoading={products.isLoading}
          className="h-calcDashboardTable whitespace-nowrap overflow-y-auto"
        />
      )}
    </footer>
  );
};

const columnStore: Columns<Buyers>[] = [
  {
    header: <p className="text-[#30b2e5] text-sm">toko terlaris</p>,
    render: (v, idx) => <p className="truncate">{`${idx + 1}. ${v.name}`}</p>,
    width: "max-w-[10rem]",
  },
  {
    header: (
      <p className="text-right text-[#30b2e5] text-sm">total omset (Rp)</p>
    ),
    render: (v) => <p className="truncate">{Currency(v.revenue)}</p>,
    width: "max-w-[10rem]",
  },
  {
    header: (
      <p className="text-right text-[#30b2e5] text-sm">total transaksi</p>
    ),
    render: (v) => <p className="truncate">{Currency(v.totalOrder)}</p>,
    width: "max-w-[10rem]",
  },
];

const columnProduct: Columns<ProductBestSelling>[] = [
  {
    header: <p className="text-[#ae5eaa] text-sm">produk terlaris</p>,
    render: (v, idx) => (
      <p className="truncate">{`${idx + 1}. ${v.productName}`}</p>
    ),
    width: "max-w-[10rem]",
  },
  {
    header: <p className="text-[#ae5eaa] text-sm">kategori</p>,
    render: (v) => <p className="truncate">{v.categoryName}</p>,
    width: "max-w-[10rem]",
  },
  {
    header: (
      <p className="text-right text-[#ae5eaa] text-sm">total pembelian</p>
    ),
    render: (v) => (
      <p className="truncate text-right">{Currency(v.orderCount)}</p>
    ),
    width: "max-w-[10rem]",
  },
];

export default Dashboard;
