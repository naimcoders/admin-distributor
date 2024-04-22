import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { BeginHeader } from "./History";
import { Textfield } from "src/components/Textfield";
import { Button } from "src/components/Button";
import ContentTextfield from "src/components/ContentTextfield";
import cx from "classnames";
import { nominals } from "./Transfer";
import {
  findPaymentChannel,
  ITopup,
  PayoutChannels,
  usePilipay,
} from "src/api/pilipay.service";
import { cn, Image } from "@nextui-org/react";
import { toast } from "react-toastify";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const Topup = () => {
  const formState = useForm<ITopup>();
  const [isOtherField, setIsOtherField] = useState(false);
  const [showListPaymentChannel, setShowListPaymentChannel] = useState(false);
  const [amount, setAmount] = useState(0);
  const [channelPayment, setPaymentChannel] = useState<PayoutChannels>();
  const paymentChannel = findPaymentChannel();
  const { topup: topupActions } = usePilipay();

  const { isTopUp, actionIsTopUp } = useActiveModal();

  const handleOther = () => {
    setAmount(0);
    setIsOtherField((v) => !v);
  };

  const onActionTopup = async () => {
    try {
      const newAmount = formState.getValues("amount");
      const fixAmount = !newAmount ? amount : Number(newAmount);

      toast.loading("Loading...", {
        toastId: "loading-topup",
      });
      await topupActions.mutateAsync({
        amount: fixAmount,
        paymentMethod: channelPayment?.paymentChannel ?? "",
        paymentType: channelPayment?.paymentMethod ?? "",
      });
      toast.success("Silakan untuk pembayaran");
    } catch (e) {
      toast.error("Gagal melakukan topup");
    } finally {
      toast.dismiss("loading-topup");
    }
  };

  return (
    <>
      <Modal
        isOpen={isTopUp}
        closeModal={actionIsTopUp}
        customHeader={<BeginHeader />}
      >
        <main className="my-4 border-t border-gray-300 pt-4 flexcol gap-4">
          <div className="relative">
            {showListPaymentChannel && (
              <ArrowLeftIcon
                width={18}
                className="cursor-pointer absolute top-1"
                title="Kembali"
                onClick={() => setShowListPaymentChannel(false)}
              />
            )}

            <h2 className="text-center">
              {!showListPaymentChannel
                ? "Top Up Pilipay"
                : "Pilih Metode Pembayaran"}
            </h2>
          </div>

          {!showListPaymentChannel ? (
            <section>
              {!isOtherField && (
                <section className="grid grid-cols-2 gap-4">
                  {nominals.map((v) => (
                    <section
                      key={v.label}
                      onClick={() => {
                        // formState.setValue("amount", v.value);
                        setAmount((a) => (!a || a !== v.value ? v.value : 0));
                      }}
                      className={cx(
                        "border border-gray-400 text-center py-2 rounded-xl cursor-pointer",
                        amount === v.value && "bg-gray-200"
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
                  defaultValue=""
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
                    label="kembali"
                    className="w-full"
                    variant="flat"
                    onClick={handleOther}
                  />
                )}
                <Button
                  onClick={() => {
                    if (!amount && !isOtherField) {
                      toast.error("Pilih nominal top up");
                      return;
                    }

                    if (isOtherField && !formState.getValues("amount")) {
                      toast.error("Masukkan nominal top up");
                      return;
                    }

                    setShowListPaymentChannel(true);
                  }}
                  label="selanjutnya"
                  className={cx("w-full", !isOtherField && "col-span-2")}
                />
              </section>
            </>
          ) : (
            <>
              <Button
                isLoading={topupActions.isPending}
                onClick={onActionTopup}
                label="Proses Topup"
                className={cx("w-full", !isOtherField && "col-span-2")}
              />
            </>
          )}
        </main>
      </Modal>
    </>
  );
};

export default Topup;
