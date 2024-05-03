import React from "react";
import cx from "classnames";
import { Modal } from "src/components/Modal";
import { ConfirmHeader } from "./Confirm";
import { findTransaction } from "src/api/transaction.service";
import Error from "src/components/Error";
import { Spinner } from "@nextui-org/react";
import { Link } from "react-router-dom";
import { Currency, convertEpochToDate } from "src/helpers";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { IconColor } from "src/types";
import { toast } from "react-toastify";
import { Button } from "src/components/Button";
import CountdownTimer from "src/components/CountdownTimer";

interface IPayment {
  topupId: string;
  isOpen: boolean;
  close: () => void;
  onBack?: () => void;
}

const getTime = (value: Date) => {
  const now = new Date(value);
  const result = `${now.getHours()}:${now.getMinutes()}`;
  return result;
};

const onClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Berhasil disalin");
  } catch (e) {
    const error = e as Error;
    toast.error(`Gagal menyalin teks ke clipboard: ${error.message}`);
  }
};

const Payment: React.FC<IPayment> = ({ isOpen, close, onBack, topupId }) => {
  const { data, isLoading, error } = findTransaction({ topupId });

  console.log(data);

  return (
    <Modal
      isOpen={isOpen}
      closeModal={close}
      customHeader={<ConfirmHeader title="pembayaran" onBack={onBack} />}
    >
      {error ? (
        <Error error={error.message} />
      ) : isLoading ? (
        <Spinner />
      ) : (
        <main>
          {!data?.actions.eWallet && (
            <section className="border-b border-gray-300 pb-3 flex items-center justify-between">
              <div>
                <p className="text-sm">Batas akhir pembayaran</p>
                {data?.actions.retail && (
                  <h2 className="font-semibold">
                    {convertEpochToDate(
                      data.actions.retail.channel_properties.expires_at
                    )}{" "}
                    {getTime(data.actions.retail.channel_properties.expires_at)}
                  </h2>
                )}
              </div>

              <Button label={<CountdownTimer />} className="bg-[#c41414]" />
            </section>
          )}
          <section
            className={cx(
              "border-b border-gray-300",
              data?.actions.eWallet ? "pb-3" : "py-3"
            )}
          >
            <h1 className="font-medium">
              {data?.paymentMethod} {data?.paymentType.split("_").join(" ")}
            </h1>
          </section>
          {data?.actions.eWallet && (
            <ActionContent
              amount={1000}
              title="Link Pembayaran"
              value={data.actions.eWallet.url}
              paymentType={data.paymentType}
              classNameWrapper="truncate py-3"
              onClipboard={() => onClipboard(data?.actions?.eWallet?.url ?? "")}
            />
          )}
          {data?.actions.retail && (
            <ActionContent
              amount={data.actions.retail.amount}
              classNameWrapper="py-3"
              onClipboard={() =>
                onClipboard(
                  data?.actions.retail?.channel_properties?.payment_code ?? ""
                )
              }
              title="Kode Pembayaran"
              value={data?.actions.retail?.channel_properties?.payment_code}
              paymentType={data.paymentType}
            />
          )}
          {data?.actions.virtualAccount && (
            <ActionContent
              amount={data.actions.virtualAccount.amount}
              classNameWrapper="py-3"
              onClipboard={() =>
                onClipboard(
                  data?.actions.virtualAccount?.channel_properties
                    ?.virtual_account_number ?? ""
                )
              }
              title="Nomor Virtual Account"
              value={
                data?.actions.virtualAccount?.channel_properties
                  ?.virtual_account_number
              }
              paymentType={data.paymentType}
            />
          )}
          <section className="py-3">
            <p className="text-sm">Total Pembayaran</p>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <h2 className="font-semibold">
                  Rp{Currency(data?.amount ?? 0)}
                </h2>
                <ClipboardIcon
                  width={16}
                  color={IconColor.zinc}
                  onClick={() => onClipboard(String(data?.amount))}
                  className="cursor-pointer"
                  title="Salin"
                />
              </div>
              <p className="text-sm text-blue-500 cursor-pointer">
                Lihat Detail
              </p>
            </div>
          </section>
          <Button label="selesai" className="mt-4 block w-full" />
        </main>
      )}
    </Modal>
  );
};

interface IAction {
  title: string;
  value: string;
  amount: number;
  paymentType: string;
  classNameWrapper?: string;
  onClipboard?: () => void;
}

const ActionContent = ({
  title,
  value,
  classNameWrapper,
  paymentType,
  onClipboard,
}: IAction) => {
  return (
    <>
      <section className={classNameWrapper}>
        <p className="text-sm mb-1">{title}</p>
        {paymentType === "EWALLET" ? (
          <Link to={value} className="text-sm text-blue-600">
            {value}
          </Link>
        ) : (
          <div className="flex gap-2">
            <h2 className="font-semibold">{value}</h2>
            <ClipboardIcon
              width={16}
              color={IconColor.zinc}
              onClick={onClipboard}
              className="cursor-pointer"
              title="Salin"
            />
          </div>
        )}
      </section>
    </>
  );
};

export default Payment;
