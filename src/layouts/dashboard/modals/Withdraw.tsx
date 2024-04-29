import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { BeginHeader } from "./History";
import { Textfield } from "src/components/Textfield";
import {
  CurrencyIDInput,
  handleErrorMessage,
  parseTextToNumber,
} from "src/helpers";
import { Button } from "src/components/Button";
import ContentTextfield from "src/components/ContentTextfield";
import { ConfirmHeader } from "./Confirm";
import cx from "classnames";
import { createWithdraw, findMeWallet } from "../../../api/pilipay.service";
import { nominals } from "./Transfer";
import Select, { SelectDataProps } from "src/components/Select";
import { findWithdraw } from "src/api/channel.service";

interface DefaultValues {
  other: string;
  pin: string;
  phoneNumber: string;
  noRek: string;
  accountHolderName: string;
}

const Withdraw = () => {
  const [isOtherField, setIsOtherField] = useState(false);
  const [amount, setAmount] = useState(0);
  const [isPin, setIsPin] = useState(false);
  const [isChannel, setIsChannel] = useState(false);
  const [channelCode, setChannelCode] = useState("");

  const { isWithdraw, actionIsWithdraw } = useActiveModal();

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    resetField,
    reset,
  } = useForm<DefaultValues>();

  const handleOther = () => {
    setAmount(0);
    resetField("other");
    setIsOtherField((v) => !v);
  };

  const onNextToChannel = handleSubmit((e) => {
    if (!wallet) return;
    if (!amount && !isOtherField) {
      toast.error("Pilih nominal withdraw");
      return;
    }

    if (isOtherField && !e.other) {
      toast.error("Masukkan nominal withdraw");
      return;
    }

    const balanceValue = wallet.balance;
    const amountOther = e.other ? parseTextToNumber(e.other) : 0;

    if (
      (amountOther && amountOther <= balanceValue) ||
      (amount && amount <= balanceValue)
    ) {
      actionIsWithdraw();
      setTimeout(() => setIsChannel(true), 500);
    } else {
      toast.error("Saldo tidak cukup");
      return;
    }
  });

  const { data: wallet } = findMeWallet(true);

  const onNextToPin = handleSubmit(() => {
    if (!channelCode) {
      toast.error("Pilih bank");
      return;
    }

    setIsChannel(false);
    setTimeout(() => setIsPin(true), 500);
  });

  const { channelData } = useBanks();
  const { mutateAsync } = createWithdraw();

  const onSubmit = handleSubmit(async (e) => {
    try {
      // await mutateAsync({
      //   amount,
      //   pin: e.pin,
      //   accountHolderName: e.accountHolderName,
      //   number: e.noRek,
      //   channelCode: "",
      //   channelCategory: "",
      // });

      console.log({
        amount,
        pin: e.pin,
        accountHolderName: e.accountHolderName,
        number: e.noRek,
        channelCode,
        channelCategory: "BANK",
      });

      toast.success("Berhasil melakukan withdraw");
      reset();
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to withdraw: ${error.message}`);
    }
  });

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
              onClick={onNextToChannel}
              label="selanjutnya"
              className={cx("w-full", !isOtherField && "col-span-2")}
            />
          </section>
        </main>
      </Modal>

      {/* CHANNEL */}
      <Modal
        isOpen={isChannel}
        closeModal={() => setIsChannel(false)}
        customHeader={
          <ConfirmHeader
            title="channel"
            onBack={() => {
              setIsChannel(false);
              setTimeout(actionIsWithdraw, 500);
            }}
          />
        }
      >
        <section className="flex flex-col gap-5">
          <Textfield
            name="accountHolderName"
            label="nama pemilik rekening"
            placeholder="masukkan pemilik rekening"
            control={control}
            defaultValue=""
            errorMessage={handleErrorMessage(errors, "accountHolderName")}
            rules={{
              required: { value: true, message: "masukkan pemilik rekening" },
            }}
          />

          <Textfield
            name="noRek"
            label="nomor rekening"
            type="number"
            placeholder="masukkan nomor rekening"
            control={control}
            defaultValue=""
            errorMessage={handleErrorMessage(errors, "noRek")}
            className="mb-2"
            rules={{
              required: { value: true, message: "masukkan nomor rekening" },
            }}
          />

          <Select
            data={channelData ?? [{ label: "Tidak ada data", value: "" }]}
            label="bank"
            placeholder="pilih bank"
            setSelected={setChannelCode}
            defaultSelectedKeys={channelCode}
          />
        </section>

        <Button
          label="selanjutnya"
          onClick={onNextToPin}
          className="mx-auto lg:mt-8 mt-5 block"
        />
      </Modal>

      {/* PIN Verification */}
      <Modal
        isOpen={isPin}
        closeModal={() => setIsPin(false)}
        customHeader={
          <ConfirmHeader
            title="verifikasi PIN"
            onBack={() => {
              setIsPin(false);
              setTimeout(() => setIsChannel(true), 500);
            }}
          />
        }
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

const useBanks = () => {
  const { data } = findWithdraw("BANK");

  const bankNames = data?.map((e) => ({
    label: e.channel_name,
    value: e.channel_code,
  }));

  const channelData: SelectDataProps[] | undefined = bankNames;

  return { channelData };
};

export default Withdraw;
