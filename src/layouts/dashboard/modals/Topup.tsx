import { useState } from "react";
import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { BeginHeader } from "./History";
import { Textfield } from "src/components/Textfield";
import { Button } from "src/components/Button";
import ContentTextfield from "src/components/ContentTextfield";
import Confirm from "./Confirm";
import cx from "classnames";
import { useNominal } from "./Transfer";
import {
  findPaymentChannel,
  ITopup,
  PayoutChannels,
  usePilipay,
} from "src/api/pilipay.service";
import { cn } from "@nextui-org/react";
import { ITransaction } from "src/api/transaction.service";
import { formatRupiah } from "src/helpers/idr";

const Topup = () => {
  const formState = useForm<ITopup>();
  const [isOtherField, setIsOtherField] = useState(false);
  const [showListPaymentChannel, setShowListPaymentChannel] = useState(false);
  const [channelPayment, setPaymentChannel] = useState<PayoutChannels>();
  const [detailTx, setDetailTx] = useState<ITransaction>();

  const paymentChannel = findPaymentChannel();
  const { topup: topupActions } = usePilipay();

  const { isTopUp, actionIsTopUp, actionIsConfirmTopUp, isConfirmTopup } =
    useActiveModal();

  const {
    nominals,
    selectedNominal,
    setSelectedNominal,
    parseSelectedNominal,
  } = useNominal();

  const handleOther = () => {
    setSelectedNominal("");
    setIsOtherField((v) => !v);
  };

  // const handleNext = () => {
  //   if (!selectedNominal && !isOtherField) {
  //     toast.error("Pilih nominal top up");
  //     return;
  //   }

  //   setTimeout(actionIsConfirmTopUp, 500);
  // };

  const onBack = () => {
    actionIsConfirmTopUp();
    setTimeout(actionIsTopUp, 500);
  };

  return (
    <>
      <Modal
        isOpen={isTopUp}
        closeModal={actionIsTopUp}
        customHeader={<BeginHeader />}
      >
        <main className="my-4 border-t border-gray-300 pt-4 flexcol gap-4">
          <h2 className="text-center">
            {!showListPaymentChannel
              ? "Top Up Pilipay"
              : "Pilih Metode Pembayaran"}
          </h2>

          {!showListPaymentChannel ? (
            <section>
              {!isOtherField && (
                <section className="grid grid-cols-2 gap-4">
                  {nominals.map((v) => (
                    <section
                      key={v.label}
                      onClick={() => v.onClick(v.label)}
                      className={cx(
                        "border border-gray-400 text-center py-2 rounded-xl cursor-pointer",
                        selectedNominal === v.label && "bg-gray-200"
                      )}
                    >
                      {v.label}
                    </section>
                  ))}
                </section>
              )}

              {!isOtherField ? (
                <section
                  onClick={handleOther}
                  className="border border-gray-400 text-center py-2 rounded-xl cursor-pointer hover:bg-gray-200"
                >
                  Lainnya
                </section>
              ) : (
                <Textfield
                  name="amount"
                  control={formState.control}
                  classNameWrapper="col-span-2"
                  placeholder="masukkan jumlah lainnya"
                  startContent={<ContentTextfield label="Rp" />}
                />
              )}
            </section>
          ) : (
            <section>
              {paymentChannel?.isLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="gap-5 grid grid-cols-3">
                  {paymentChannel?.data?.map((v, k) => {
                    if (v.paymentMethod !== "PAYLATER")
                      return (
                        <div
                          key={k}
                          onClick={() => setPaymentChannel(v)}
                          className={cn(
                            "p-2 shadow-md hover:bg-gray-300 cursor-pointer rounded-md flex border-1 border-gray-200",
                            v === channelPayment && "bg-gray-300"
                          )}
                        >
                          <p></p>
                          <img
                            src={v.imageUrl}
                            alt="imge"
                            className="w-[100px] h-[30px] object-contain"
                          />
                          {/* <p>{v.paymentMethod}</p> */}
                        </div>
                      );
                  })}
                </div>
              )}
            </section>
          )}

          {!showListPaymentChannel ? (
            <>
              <section className="grid grid-cols-2 gap-4 mt-4">
                {isOtherField && (
                  <Button
                    aria-label="kembali"
                    className="w-full"
                    variant="flat"
                    onClick={handleOther}
                  />
                )}
                <Button
                  onClick={() => setShowListPaymentChannel(true)}
                  aria-label="selanjutnya"
                  className={cx("w-full", !isOtherField && "col-span-2")}
                />
              </section>
            </>
          ) : (
            <>
              <Button
                isLoading={topupActions.isPending}
                onClick={() =>
                  topupActions
                    .mutateAsync({
                      amount: parseInt(selectedNominal),
                      paymentMethod: channelPayment?.paymentChannel ?? "",
                      paymentType: channelPayment?.paymentMethod ?? "",
                    })
                    .then((v) => {
                      setDetailTx(v);
                    })
                }
                aria-label="Proses Topup"
                className={cx("w-full", !isOtherField && "col-span-2")}
              />
            </>
          )}
        </main>
      </Modal>

      {detailTx && (
        <Confirm
          title="Topup"
          onBack={onBack}
          isModal={isConfirmTopup}
          actionModal={actionIsConfirmTopUp}
          selectedNominal={parseSelectedNominal()}
        >
          Lakukan pembayaran {formatRupiah(Number(detailTx?.amount))}{" "}
          Menggunakan melalui {detailTx?.actions?.eWallet?.urlType}
        </Confirm>
      )}
    </>
  );
};

export default Topup;
