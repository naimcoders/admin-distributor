import cx from "classnames";
import withdrawLogo from "src/assets/images/withdraw.png";
import transferImg from "src/assets/images/transfer.png";
import topUpImg from "src/assets/images/top up.png";
import pemesanImg from "src/assets/images/pemesan.png";
import pilipayLogo from "src/assets/images/pilipay.png";
import Image from "src/components/Image";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import React, { FC, ReactNode } from "react";
import {
  getPilipayTransactions,
  HistoryPilipay,
  ITransaction,
} from "src/api/pilipay.service";
import { Link, Spinner } from "@nextui-org/react";
import { create } from "zustand";
import {
  EITransactionStatus,
  findTransaction,
  IQueryTransaction,
} from "src/api/transaction.service";
import { formatRupiah } from "src/helpers/idr";
import {
  Currency,
  convertEpochToDate,
  epochToDateConvert,
  parsePhoneNumber,
} from "src/helpers";
import Tabs, { ITabs } from "src/components/Tabs";
import Error from "src/components/Error";
import Pagination from "src/components/Pagination";

type TStateHistory = {
  data: HistoryPilipay | null;
  setHistory: (data: HistoryPilipay | null) => void;
};

const stateHistoryDetail = create<TStateHistory>((set) => ({
  data: null,
  setHistory: (data) => set({ data }),
}));

// const bindingTypeHistory = (history: HistoryPilipay): ETypeHistoryPilipay => {
//   if (history.topupRequestId) return ETypeHistoryPilipay.TOPUP;
//   if (history.withdrawRequestId) return ETypeHistoryPilipay.WITHDRAW;
//   if (history.orderId) return ETypeHistoryPilipay.ORDER;
//   return ETypeHistoryPilipay.TRANSFER;
// };

const bindingHistoryTx = (h: HistoryPilipay | null): IQueryTransaction => {
  if (!h) return { orderId: "", topupId: "", transactionId: "" };
  if (h.topupRequestId) return { topupId: h.topupRequestId };
  if (h.withdrawRequestId) return { transactionId: h.withdrawRequestId };
  if (h.orderId) return { orderId: h.orderId };
  return { orderId: "", topupId: "", transactionId: "" };
};

export const BeginHeader: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <header className="flexcol gap-2">
      <section>
        <img
          src={pilipayLogo}
          alt="Pilipay"
          className="w-[10rem]"
          loading="lazy"
        />
      </section>
      {children}
    </header>
  );
};

interface IItemHistory {
  isLoading: boolean;
  error: string;
  children: React.ReactNode;
  data: ITransaction[];
  onNext: () => void;
  onPrev: () => void;
  page: number;
  isNext?: boolean;
}

const ItemHistory = (props: IItemHistory) => {
  return (
    <main>
      {props.error ? (
        <Error error={props.error} />
      ) : props.isLoading ? (
        <Spinner />
      ) : props.data.length < 1 ? (
        <h1 className="font-semibold text-lg text-center mt-2">
          Tidak ada data
        </h1>
      ) : (
        props.children
      )}

      <Pagination
        page={props.page}
        next={props.onNext}
        prev={props.onPrev}
        isNext={props.isNext}
        baseClassName="absolute bottom-0 right-0"
      />
    </main>
  );
};

const TopUp = () => {
  const { data, isLoading, error, isNext, page, setPage } =
    getPilipayTransactions("TOPUP");

  const onNext = () => setPage((v) => v + 1);
  const onPrev = () => setPage((v) => v - 1);

  return (
    <ItemHistory
      isLoading={isLoading}
      error={error ?? ""}
      data={data?.items ?? []}
      isNext={isNext}
      onNext={onNext}
      onPrev={onPrev}
      page={page}
    >
      <main className="overflow-y-auto whitespace-nowrap h-[13.5rem] pr-2">
        <section className="flex flex-col gap-4 my-2">
          {data?.items.map((v) => (
            <section className="flex items-center justify-between" key={v.id}>
              <div className="flex items-center gap-4">
                <Image
                  src={topUpImg}
                  alt="topup image"
                  loading="lazy"
                  width={30}
                />
                <div className="flex flex-col">
                  <h2 className="font-semibold">{v.type}</h2>
                  <p className="text-sm">{v.topup?.paymentMethod}</p>
                </div>
              </div>

              <h2 className="font-semibold text-blue-600">
                +Rp {Currency(v.amount)}
              </h2>
            </section>
          ))}
        </section>
      </main>
    </ItemHistory>
  );
};

const Withdraw = () => {
  const { data, isLoading, error, isNext, page, setPage } =
    getPilipayTransactions("WITHDRAW");

  const onNext = () => setPage((v) => v + 1);
  const onPrev = () => setPage((v) => v - 1);

  return (
    <ItemHistory
      isLoading={isLoading}
      error={error ?? ""}
      data={data?.items ?? []}
      isNext={isNext}
      onNext={onNext}
      onPrev={onPrev}
      page={page}
    >
      <main className="overflow-y-auto whitespace-nowrap h-[13.5rem] pr-2">
        <section className="flex flex-col gap-4 my-2">
          {data?.items.map((v) => (
            <section className="flex items-center justify-between" key={v.id}>
              <div className="flex items-center gap-4">
                <Image
                  src={withdrawLogo}
                  alt="withdraw image"
                  loading="lazy"
                  width={30}
                />
                <div className="flex flex-col">
                  <h2 className="font-semibold">{v.withdraw?.numberAccount}</h2>
                  <p className="text-sm">{v.withdraw?.channelCode}</p>
                </div>
              </div>

              <h2 className="font-semibold">Rp {Currency(v.amount)}</h2>
            </section>
          ))}
        </section>
      </main>
    </ItemHistory>
  );
};

const Transfer = () => {
  const { data, isLoading, error, isNext, page, setPage } =
    getPilipayTransactions("TRANSFER_BALANCE");

  const onNext = () => setPage((v) => v + 1);
  const onPrev = () => setPage((v) => v - 1);

  return (
    <ItemHistory
      isLoading={isLoading}
      error={error ?? ""}
      data={data?.items ?? []}
      isNext={isNext}
      onNext={onNext}
      onPrev={onPrev}
      page={page}
    >
      <main className="overflow-y-auto whitespace-nowrap h-[13.5rem] pr-2">
        <section className="flex flex-col gap-4 my-2">
          {data?.items.map((v) => (
            <section className="flex items-center justify-between" key={v.id}>
              <div className="flex items-center gap-4">
                <Image
                  src={transferImg}
                  alt="transfer image"
                  loading="lazy"
                  width={30}
                />
                <h2 className="font-semibold">
                  {parsePhoneNumber(v.transfer?.toPhoneNumber)}
                </h2>
              </div>

              <h2 className="font-semibold">Rp {Currency(v.amount)}</h2>
            </section>
          ))}
        </section>
      </main>
    </ItemHistory>
  );
};

const Order = () => {
  const { data, isLoading, error, isNext, page, setPage } =
    getPilipayTransactions("ORDER");

  const onNext = () => setPage((v) => v + 1);
  const onPrev = () => setPage((v) => v - 1);

  return (
    <ItemHistory
      isLoading={isLoading}
      error={error ?? ""}
      data={data?.items ?? []}
      isNext={isNext}
      onNext={onNext}
      onPrev={onPrev}
      page={page}
    >
      <main className="overflow-y-auto whitespace-nowrap h-[13.5rem] pr-2">
        <section className="flex flex-col gap-4 my-2">
          {data?.items.map((v) => (
            <section className="flex items-center justify-between" key={v.id}>
              <div className="flex items-center gap-4">
                <Image
                  src={pemesanImg}
                  alt="order image"
                  loading="lazy"
                  width={30}
                />
                <h2 className="font-semibold">
                  Rp {Currency(v.orders?.amount ?? 0)}
                </h2>
              </div>

              <h2>{epochToDateConvert(v.createdAt)}</h2>
            </section>
          ))}
        </section>
      </main>
    </ItemHistory>
  );
};

const History = () => {
  const { isHistory, actionIsHistory } = useActiveModal();
  // const dataHistory = findMeWallet(true);
  const setDetailHistory = stateHistoryDetail((v) => v.setHistory);
  const dataHistoryState = stateHistoryDetail((v) => v.data);
  // const navigate = useNavigate();

  // const onDetail = (history: HistoryPilipay) => {
  //   if (!history.orderId) setDetailHistory(history);
  //   else navigate(`/order/complete/${history.orderId}`);
  // };

  const tabsItems: ITabs[] = [
    {
      label: "Top up",
      content: <TopUp />,
    },
    {
      label: "Withdraw",
      content: <Withdraw />,
    },
    {
      label: "Transfer",
      content: <Transfer />,
    },
    {
      label: "Pendapatan",
      content: <Order />,
    },
  ];

  return (
    <Modal
      isOpen={isHistory}
      closeModal={() => {
        actionIsHistory();
        setDetailHistory(null);
      }}
      customHeader={<BeginHeader />}
      width="min-w-[40rem]"
    >
      {dataHistoryState && <DetailHistory />}

      {!dataHistoryState && (
        <div className="min-h-[20rem] max-h-[20rem] overflow-auto mt-5 mb-2 relative">
          {/* {dataHistory?.isLoading && !dataHistory?.data && <Spinner />} */}

          <Tabs items={tabsItems} color="primary" />

          {/* {pilipayTransactions.data?.items && (
            <section className="mt-5">
              {pilipayTransactions.data.items.map((v) => (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image
                      src={topUpImg}
                      alt="topup image"
                      loading="lazy"
                      width={30}
                    />
                    <div className="flex flex-col">
                      <h2 className="font-semibold">{v.type}</h2>
                      <p className="text-sm">{v.topup?.paymentMethod}</p>
                    </div>
                  </div>

                  <h2 className="font-semibold text-blue-600">
                    +Rp {Currency(v.amount)}
                  </h2>
                </div>
              ))}
            </section>
          )} */}

          {/* {dataHistory?.data && (
            <section className="mt-5">
              {dataHistory.data.history?.map((it) => (
                <div key={it.id} className="border-gray-300 mt-3">
                  <HistoryContent
                    history={it}
                    type={bindingTypeHistory(it)}
                    onClick={() => onDetail(it)}
                    icon={{
                      src: it?.topupRequestId ? topUpImg : transferImg,
                      alt: "Top Up Image",
                    }}
                    label={
                      it?.topupRequestId
                        ? "Top up"
                        : it?.withdrawRequestId
                        ? "Withdraw"
                        : "Transfer"
                    }
                  />
                  <div className="bg-gray-200 w-full h-[1px] mt-2" />
                </div>
              ))}
            </section>
          )} */}
        </div>
      )}
    </Modal>
  );
};

const DetailHistory = () => {
  const data = stateHistoryDetail((v) => v.data);
  const setHistoryDetail = stateHistoryDetail((v) => v.setHistory);
  const dataTransaction = findTransaction(bindingHistoryTx(data));
  const paymentActions = dataTransaction?.data?.actions;

  return (
    <div>
      {dataTransaction.isLoading && !dataTransaction?.data && <Spinner />}
      {dataTransaction.data && paymentActions && (
        <section>
          {paymentActions && (
            <div className="mt-5 flex justify-between">
              <div>
                <p className="text-xs">
                  {convertEpochToDate(dataTransaction.data.createdAt)}
                </p>
                <div className="mt-2">
                  <p className="text-lg font-bold">
                    {dataTransaction.data.paymentMethod}
                  </p>

                  {dataTransaction.data.status ===
                    EITransactionStatus.PENDING && (
                    <div>
                      {paymentActions.eWallet && (
                        <Link
                          isExternal
                          href={paymentActions.eWallet.url}
                          className="text-xs -mt-1"
                          onClick={() => setHistoryDetail(null)}
                        >
                          Klik Link Untuk Pembayaran
                        </Link>
                      )}
                      {paymentActions.virtualAccount && (
                        <p className="-mt-1">
                          {
                            paymentActions.virtualAccount.channel_properties
                              .virtual_account_number
                          }
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/*  */}
              <div>
                <h2 className={cx("font-interMedium")}>
                  {formatRupiah(dataTransaction.data.amount)}
                </h2>
                <div
                  className={cx(
                    "mt-1 text-xs font-medium me-2 px-2.5 py-0.5 pb-1 rounded",
                    dataTransaction.data.status ===
                      EITransactionStatus.SUCCESS &&
                      "bg-green-100  text-green-800",
                    dataTransaction.data.status ===
                      EITransactionStatus.FAILED && "bg-red-100  text-red-800",
                    dataTransaction.data.status ===
                      EITransactionStatus.PENDING &&
                      "bg-blue-100  text-blue-800"
                  )}
                >
                  <p className="capitalize text-center">
                    {dataTransaction.data.status.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

// const HistoryContent: React.FC<{
//   icon: { src: string; alt: string };
//   label: string;
//   history: HistoryPilipay;
//   type: ETypeHistoryPilipay;
//   onClick: () => void;
// }> = (props) => {
//   return (
//     <section className="flex justify-between">
//       <section className="flex items-center gap-3">
//         <Image
//           src={props.icon.src}
//           alt={props.icon.alt}
//           width={25}
//           radius="none"
//         />
//         <section>
//           <h2 className="font-interMedium text-sm">{props.label}</h2>
//           <p
//             onClick={props.onClick}
//             className="text-xs underline cursor-pointer"
//           >
//             Detail
//           </p>
//         </section>
//       </section>

//       <div className="w-[7rem]">
//         <div
//           className={cx(
//             "font-interMedium inline-flex space-x-2 place-items-center",
//             props.type === ETypeHistoryPilipay.TOPUP && "text-[#2754bb]"
//           )}
//         >
//           {props.history.status === EITransactionStatus.PENDING ? (
//             <HiOutlineArrowPath className="h-4 w-4" />
//           ) : props.history.status === EITransactionStatus.SUCCESS ? (
//             <>
//               {props.type === ETypeHistoryPilipay.TOPUP ? (
//                 <HiOutlinePlusCircle className="h-4 w-4" />
//               ) : (
//                 <HiOutlineMinusCircle className="h-4 w-4" />
//               )}
//             </>
//           ) : (
//             <HiOutlineXMark className="h-4 w-4" />
//           )}
//           <p className="text-xs">{formatRupiah(props.history.amount)}</p>
//         </div>
//         <p className="font-interMedium text-[0.60rem]">
//           {convertEpochToDate(props.history.createdAt)}
//         </p>
//       </div>
//     </section>
//   );
// };

export default History;
