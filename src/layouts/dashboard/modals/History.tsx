import cx from "classnames";
import transferImg from "src/assets/images/transfer.png";
import topUpImg from "src/assets/images/top up.png";
import pilipayLogo from "src/assets/images/pilipay.png";
import Image from "src/components/Image";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { FC, ReactNode } from "react";
import {
  ETypeHistoryPilipay,
  findMeWallet,
  HistoryPilipay,
} from "src/api/pilipay.service";
import { Link, Spinner } from "@nextui-org/react";
import { create } from "zustand";
import {
  EITransactionStatus,
  findTransaction,
  IQueryTransaction,
} from "src/api/transaction.service";
import { formatRupiah } from "src/helpers/idr";
import { convertEpochToDate } from "src/helpers";
import {
  HiOutlineArrowPath,
  HiOutlinePlusCircle,
  HiOutlineXMark,
  HiOutlineMinusCircle,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

type TStateHistory = {
  data: HistoryPilipay | null;
  setHistory: (data: HistoryPilipay | null) => void;
};

const stateHistoryDetail = create<TStateHistory>((set) => ({
  data: null,
  setHistory: (data) => set({ data }),
}));

const bindingTypeHistory = (history: HistoryPilipay): ETypeHistoryPilipay => {
  if (history.topupRequestId) return ETypeHistoryPilipay.TOPUP;
  if (history.withdrawRequestId) return ETypeHistoryPilipay.WITHDRAW;
  if (history.orderId) return ETypeHistoryPilipay.ORDER;
  return ETypeHistoryPilipay.TRANSFER;
};

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

const History = () => {
  const { isHistory, actionIsHistory } = useActiveModal();
  const dataHistory = findMeWallet(true);
  const setDetailHistory = stateHistoryDetail((v) => v.setHistory);
  const dataHistoryState = stateHistoryDetail((v) => v.data);
  const navigate = useNavigate();

  const onDetail = (history: HistoryPilipay) => {
    if (!history.orderId) setDetailHistory(history);
    else navigate(`/order/complete/${history.orderId}`);
  };

  return (
    <Modal
      isOpen={isHistory}
      closeModal={() => {
        actionIsHistory();
        setDetailHistory(null);
      }}
      customHeader={<BeginHeader />}
    >
      {dataHistoryState && <DetailHistory />}

      {!dataHistoryState && (
        <div className="min-h-[20rem] max-h-[20rem] overflow-auto">
          {dataHistory?.isLoading && !dataHistory?.data && <Spinner />}
          {dataHistory?.data && (
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
          )}
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

const HistoryContent: React.FC<{
  icon: { src: string; alt: string };
  label: string;
  history: HistoryPilipay;
  type: ETypeHistoryPilipay;
  onClick: () => void;
}> = (props) => {
  return (
    <section className="flex justify-between">
      <section className="flex items-center gap-3">
        <Image
          src={props.icon.src}
          alt={props.icon.alt}
          width={25}
          radius="none"
        />
        <section>
          <h2 className="font-interMedium text-sm">{props.label}</h2>
          <p
            onClick={props.onClick}
            className="text-xs underline cursor-pointer"
          >
            Detail
          </p>
        </section>
      </section>

      <div className="w-[7rem]">
        <div
          className={cx(
            "font-interMedium inline-flex space-x-2 place-items-center",
            props.type === ETypeHistoryPilipay.TOPUP && "text-[#2754bb]"
          )}
        >
          {props.history.status === EITransactionStatus.PENDING ? (
            <HiOutlineArrowPath className="h-4 w-4" />
          ) : props.history.status === EITransactionStatus.SUCCESS ? (
            <>
              {props.type === ETypeHistoryPilipay.TOPUP ? (
                <HiOutlinePlusCircle className="h-4 w-4" />
              ) : (
                <HiOutlineMinusCircle className="h-4 w-4" />
              )}
            </>
          ) : (
            <HiOutlineXMark className="h-4 w-4" />
          )}
          <p className="text-xs">{formatRupiah(props.history.amount)}</p>
        </div>
        <p className="font-interMedium text-[0.60rem]">
          {convertEpochToDate(props.history.createdAt)}
        </p>
      </div>
    </section>
  );
};

export default History;
