import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { BeginHeader } from "./History";
import { Textfield } from "src/components/Textfield";
import { Button } from "src/components/Button";
import ContentTextfield from "src/components/ContentTextfield";
import cx from "classnames";
import { useNominal } from "./Transfer";
import {
  findPaymentChannel,
  ITopup,
  PayoutChannels,
  usePilipay,
} from "src/api/pilipay.service";
import { cn, Image, Link } from "@nextui-org/react";
import { ITransaction } from "src/api/transaction.service";
import { formatRupiah } from "src/helpers/idr";

const Topup = () => {
  const formState = useForm<ITopup>();
  const [isOtherField, setIsOtherField] = useState(false);
  const [showListPaymentChannel, setShowListPaymentChannel] = useState(false);
  const [channelPayment, setPaymentChannel] = useState<PayoutChannels>();
  // const [detailTx, setDetailTx] = useState<ITransaction>();
  const paymentChannel = findPaymentChannel();
  const { topup: topupActions } = usePilipay();

  const { isTopUp, actionIsTopUp } = useActiveModal();
  const { nominals, selectedNominal, setSelectedNominal } = useNominal();

  const handleOther = () => {
    setSelectedNominal("");
    setIsOtherField((v) => !v);
  };

  return (
    <>
      <Modal
        isOpen={isTopUp}
        closeModal={actionIsTopUp}
        customHeader={<BeginHeader />}
      >
        <main className="my-4 border-t border-gray-300 pt-4 flexcol gap-4">
          {!detailTx && (
            <Fragment>
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
                          onClick={() => {
                            formState.setValue("amount", Number(v.value));
                            setSelectedNominal(v.label);
                          }}
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
                      className="border mt-4 border-gray-400 text-center py-2 rounded-xl cursor-pointer hover:bg-gray-200"
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
                              <Image
                                src={v.imageUrl}
                                fallbackSrc="https://via.placeholder.com/300x200"
                                alt="imge"
                                className="w-[100px] h-[30px] object-contain"
                              />
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
                          amount: Number(formState.getValues("amount")),
                          paymentMethod: channelPayment?.paymentChannel ?? "",
                          paymentType: channelPayment?.paymentMethod ?? "",
                        })
                        .then((v) => {
                          alert(v);
                        })
                    }
                    aria-label="Proses Topup"
                    className={cx("w-full", !isOtherField && "col-span-2")}
                  />
                </>
              )}
            </Fragment>
          )}
        </main>
      </Modal>

      {/* {detailTx && (
        <div>
          <p>Lakukan pembayaran {formatRupiah(Number(detailTx?.amount))}</p>

          {detailTx?.actions?.eWallet && (
            <div className="text-md  space-y-2">
              <p>Menggunakan melalui {detailTx?.actions?.eWallet?.url}</p>
              <Link href={detailTx?.actions?.eWallet?.url}>
                Klik Link Untuk Pembayaran
              </Link>
            </div>
          )}
        </div>
      )} */}
    </>
  );
};

export default Topup;
