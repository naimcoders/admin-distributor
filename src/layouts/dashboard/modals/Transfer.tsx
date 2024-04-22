import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { BeginHeader } from "./History";
import { Textfield } from "src/components/Textfield";
import { Currency, CurrencyIDInput, handleErrorMessage } from "src/helpers";
import { Button } from "src/components/Button";
import ContentTextfield from "src/components/ContentTextfield";
import Confirm from "./Confirm";
import cx from "classnames";

const Transfer = () => {
  const [isOtherField, setIsOtherField] = useState(false);
  const [amount, setAmount] = useState(0);

  const {
    isTransfer,
    actionIsTransfer,
    actionIsConfirmTransfer,
    isConfirmTransfer,
  } = useActiveModal();

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();

  const handleOther = () => {
    setAmount(0);
    setIsOtherField((v) => !v);
  };

  const handleNext = () => {
    if (!amount && !isOtherField) {
      toast.error("Pilih nominal transfer");
      return;
    }

    actionIsTransfer();
    setTimeout(actionIsConfirmTransfer, 500);
  };

  const onBack = () => {
    actionIsConfirmTransfer();
    setTimeout(actionIsTransfer, 500);
  };

  const onSubmit = handleSubmit((e) => {
    console.log(e);
    actionIsConfirmTransfer();
  });

  return (
    <>
      <Modal
        isOpen={isTransfer}
        closeModal={actionIsTransfer}
        customHeader={<BeginHeader />}
      >
        <main className="my-4 border-t border-gray-300 pt-4 flex flex-col gap-4">
          <h2 className="text-center">Transfer Pilipay</h2>

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

      <Confirm
        onBack={onBack}
        title="transfer"
        isModal={isConfirmTransfer}
        actionModal={actionIsConfirmTransfer}
        selectedNominal={amount}
      >
        <Textfield
          type="number"
          defaultValue=""
          control={control}
          name="phoneNumber"
          label="nomor ponsel pilipay"
          placeholder="masukkan nomor ponsel tujuan"
          errorMessage={handleErrorMessage(errors, "phoneNumber")}
          classNameWrapper="border-t border-gray-300 pt-4 pb-2"
          rules={{
            required: {
              value: true,
              message: "masukkan nomor ponsel tujuan",
            },
          }}
        />

        <section className="flexcol gap-2 border-t border-gray-300 pt-4">
          <h2>Ringkasan Transaksi</h2>

          <section className="text-sm">
            <section className="flex justify-between">
              <h2>Jumlah Transfer</h2>
              <p>Rp{Currency(amount)}</p>
            </section>
            <section className="flex justify-between">
              <h2>Biaya Transfer</h2>
              <p>Rp0</p>
            </section>
          </section>
        </section>

        <section className="border-t border-gray-300 py-4 flex justify-between font-semibold">
          <h2>Total</h2>
          <p>Rp{Currency(amount)}</p>
        </section>

        <Button label="konfirmasi" className="w-full" onClick={onSubmit} />
      </Confirm>
    </>
  );
};

export const nominals: NominalProps[] = [
  { value: 50000, label: "50k" },
  { value: 100000, label: "100k" },
  { value: 200000, label: "200k" },
  { value: 500000, label: "500k" },
];

interface NominalProps {
  value: number;
  label: string;
}

export const useNominal = () => {
  const [selectedNominal, setSelectedNominal] = useState("");

  // const nominals: NominalProps[] = [
  //   { value: "50000", label: "50k" },
  //   { value: "100000", label: "100k" },
  //   { value: "200000", label: "200k" },
  //   { value: "500000", label: "500k" },
  // ];

  const parseSelectedNominal = (): string => {
    const parseit = selectedNominal.split("k")[0];
    return `${parseit}.000`;
  };

  return {
    nominals,
    selectedNominal,
    setSelectedNominal,
    parseSelectedNominal,
  };
};

export default Transfer;
