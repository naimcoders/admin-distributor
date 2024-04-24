import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { BeginHeader } from "./History";
import { Textfield } from "src/components/Textfield";
import { CurrencyIDInput, handleErrorMessage } from "src/helpers";
import { Button } from "src/components/Button";
import ContentTextfield from "src/components/ContentTextfield";
import { ConfirmHeader } from "./Confirm";
import cx from "classnames";
import { findMeWallet } from "../../../api/pilipay.service";
import { nominals } from "./Transfer";

interface DefaultValues {
  other: string;
  pin: string;
}

const Withdraw = () => {
  const [isOtherField, setIsOtherField] = useState(false);
  const [amount, setAmount] = useState(0);

  const {
    isWithdraw,
    actionIsWithdraw,
    actionIsConfirmTransfer,
    isPin,
    actionIsPin,
  } = useActiveModal();

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm<DefaultValues>();

  const handleOther = () => {
    setAmount(0);
    resetField("other");
    setIsOtherField((v) => !v);
  };

  const handleNext = handleSubmit((e) => {
    if (!amount && !isOtherField) {
      toast.error("Pilih nominal transfer");
      return;
    }

    if (isOtherField && !e.other) {
      toast.error("Masukkan nominal transfer");
      return;
    }

    console.log(amount);

    // if (e.other) setAmount(parseTextToNumber(e.other));

    // actionIsWithdraw();
    // setTimeout(actionIsPin, 500);
  });

  const onBack = () => {
    actionIsPin();
    resetField("pin");
    setTimeout(actionIsWithdraw, 500);
  };

  const { data: wallet } = findMeWallet(true);

  const onSubmit = () => {
    if (!wallet) return;
    if (amount <= wallet.balance) {
      actionIsConfirmTransfer();
      setTimeout(actionIsPin, 500);
    } else {
      toast.error("Saldo tidak cukup");
      return;
    }
  };

  // const onSubmit = handleSubmit(async (e) => {
  //   try {
  //     toast.loading("Loading...", { toastId: "transfer-loading" });
  //     const newPhoneNumber = parsePhoneNumber(e.phoneNumber);
  //     await mutateAsync({ amount, pin: e.pin, toPhoneNumber: newPhoneNumber });

  //     toast.success("Transfer berhasil");
  //     actionIsPin();
  //     setAmount(0);
  //     reset();
  //   } catch (e) {
  //     const error = e as Error;
  //     toast.error(`Failed to transfer: ${error.message}`);
  //   } finally {
  //     toast.dismiss("transfer-loading");
  //   }
  // });

  return (
    <>
      <Modal
        isOpen={isWithdraw}
        closeModal={actionIsWithdraw}
        customHeader={<BeginHeader />}
      >
        <main className="my-4 border-t border-gray-300 pt-4 flex flex-col gap-4">
          <h2 className="text-center">Withdraw Pilipay</h2>

          {!isOtherField && (
            <section className="grid grid-cols-2 gap-4">
              {nominals.map((v) => (
                <section
                  key={v.label}
                  onClick={() =>
                    setAmount((nominal) =>
                      !nominal || nominal !== v.value ? v.value : 0
                    )
                  }
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
              className="border border-gray-400 text-center py-2 rounded-xl cursor-pointer hover:bg-gray-200"
            >
              Lainnya
            </section>
          ) : (
            <Textfield
              name="other"
              defaultValue=""
              control={control}
              classNameWrapper="col-span-2"
              placeholder="masukkan jumlah lainnya"
              startContent={<ContentTextfield label="Rp" />}
              rules={{
                onBlur: (e) =>
                  CurrencyIDInput({
                    type: "rp",
                    fieldName: "other",
                    setValue,
                    value: e.target.value,
                  }),
              }}
            />
          )}

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
              onClick={handleNext}
              label="selanjutnya"
              className={cx("w-full", !isOtherField && "col-span-2")}
            />
          </section>
        </main>
      </Modal>

      {/* PIN Verification */}
      <Modal
        isOpen={isPin}
        closeModal={actionIsPin}
        customHeader={<ConfirmHeader title="verifikasi PIN" onBack={onBack} />}
      >
        <Textfield
          name="pin"
          label="Masukkan PIN Anda"
          control={control}
          defaultValue=""
          errorMessage={handleErrorMessage(errors, "pin")}
          classNames={{ input: "text-center" }}
          rules={{ required: { value: true, message: "Masukkan PIN" } }}
        />
        <Button
          label="withdraw"
          onClick={onSubmit}
          className="mx-auto lg:mt-6 mt-4 block"
        />
      </Modal>
    </>
  );
};

export default Withdraw;
