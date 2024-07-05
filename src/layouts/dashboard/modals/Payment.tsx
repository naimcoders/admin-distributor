import React from "react";
import cx from "classnames";
import { Modal } from "src/components/Modal";
import { ConfirmHeader } from "./Confirm";
import { Link } from "react-router-dom";
import { Currency, convertEpochToDate, onClipboard } from "src/helpers";
import { HiOutlineClipboard } from "react-icons/hi2";
import { IconColor } from "src/types";
import { Button } from "src/components/Button";
import CountdownTimer from "src/components/CountdownTimer";
import { IResTopup } from "src/api/pilipay.service";

interface IPayment {
  resultTopup: IResTopup;
  paymentType: string;
  isOpen: boolean;
  close: () => void;
  onClearState: () => void;
  onBack?: () => void;
}

const getTime = (value: Date | undefined) => {
  if (!value) return;
  const now = new Date(value);
  const result = `${now.getHours()}:${now.getMinutes()}`;
  return result;
};

const Payment: React.FC<IPayment> = ({
  isOpen,
  close,
  onBack,
  onClearState,
  resultTopup,
  paymentType,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      closeModal={close}
      customHeader={<ConfirmHeader title="pembayaran" onBack={onBack} />}
    >
      <main>
        {/* BUKAN EWALLET */}
        {paymentType !== "EWALLET" && (
          <section className="border-b border-gray-300 pb-3 flex items-center justify-between">
            <div>
              <p className="text-sm">Batas akhir pembayaran</p>
              <h2 className="font-semibold">
                {convertEpochToDate(
                  resultTopup?.virtualAccount?.channel_properties.expires_at ??
                    resultTopup.retail?.channel_properties.expires_at ??
                    0
                )}{" "}
                {getTime(
                  resultTopup?.virtualAccount?.channel_properties.expires_at ??
                    resultTopup.retail?.channel_properties.expires_at
                )}
              </h2>
            </div>

            <Button
              label={<CountdownTimer />}
              className="bg-[#c41414]"
              disabled
            />
          </section>
        )}

        <section
          className={cx(
            "border-b border-gray-300",
            resultTopup.eWallet ? "pb-3" : "py-3"
          )}
        >
          <h1 className="font-medium">
            {resultTopup.virtualAccount?.channel_code ??
              resultTopup.retail?.channel_code}
          </h1>
        </section>

        {resultTopup.eWallet && (
          <ActionContent
            title="Link Pembayaran"
            value={resultTopup.eWallet?.url ?? ""}
            paymentType={"EWALLET"}
            classNameWrapper="truncate py-3"
            onClipboard={() => onClipboard(resultTopup.eWallet?.url ?? "")}
            onCloseModalPayment={() => {
              close();
              onClearState();
            }}
          />
        )}

        {resultTopup.retail && (
          <ActionContent
            classNameWrapper="py-3"
            onClipboard={() =>
              onClipboard(
                resultTopup.retail?.channel_properties.payment_code ?? ""
              )
            }
            title="Kode Pembayaran"
            value={resultTopup.retail?.channel_properties.payment_code}
            paymentType={paymentType}
          />
        )}

        {resultTopup.virtualAccount && (
          <ActionContent
            classNameWrapper="py-3"
            onClipboard={() =>
              onClipboard(
                resultTopup.virtualAccount?.channel_properties
                  ?.virtual_account_number ?? ""
              )
            }
            title="Nomor Virtual Account"
            value={
              resultTopup.virtualAccount?.channel_properties
                .virtual_account_number
            }
            paymentType={paymentType}
          />
        )}

        <section className="py-3">
          <p className="text-sm">Total Pembayaran</p>
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <h2 className="font-semibold">
                Rp
                {Currency(
                  resultTopup.virtualAccount?.amount ??
                    resultTopup.retail?.amount ??
                    0
                )}
              </h2>
              <HiOutlineClipboard
                size={16}
                color={IconColor.zinc}
                onClick={() =>
                  onClipboard(
                    String(
                      resultTopup?.virtualAccount?.amount ??
                        resultTopup.retail?.amount
                    )
                  )
                }
                className="cursor-pointer"
                title="Salin"
              />
            </div>
            <p className="text-sm text-blue-500 cursor-pointer text-center">
              Lihat Detail
            </p>
          </div>
        </section>

        <Button
          label="selesai"
          className="mt-4 block w-full"
          onClick={() => {
            close();
            onClearState();
          }}
        />
      </main>
    </Modal>
  );
};

interface IAction {
  title: string;
  value: string;
  paymentType: string;
  onCloseModalPayment?: () => void;
  classNameWrapper?: string;
  onClipboard?: () => void;
}

const ActionContent = ({
  title,
  value,
  classNameWrapper,
  paymentType,
  onClipboard,
  onCloseModalPayment,
}: IAction) => {
  return (
    <section className={classNameWrapper}>
      <p className="text-sm mb-1">{title}</p>
      {paymentType === "EWALLET" ? (
        <Link
          to={value}
          className="text-sm text-blue-600"
          target="_blank"
          onClick={onCloseModalPayment}
        >
          {value}
        </Link>
      ) : (
        <div className="flex gap-2">
          <h2 className="font-semibold">{value}</h2>
          <HiOutlineClipboard
            size={16}
            color={IconColor.zinc}
            onClick={onClipboard}
            className="cursor-pointer"
            title="Salin"
          />
        </div>
      )}
    </section>
  );
};

export default Payment;
