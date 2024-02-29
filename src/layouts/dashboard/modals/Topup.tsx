import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { BeginHeader } from "./History";
import { Textfield } from "src/components/Textfield";
import { CurrencyIDInput } from "src/helpers";
import { Button } from "src/components/Button";
import ContentTextfield from "src/components/ContentTextfield";
import Confirm from "./Confirm";
import cx from "classnames";
import { useNominal } from "./Transfer";

const Topup = () => {
  const [isOtherField, setIsOtherField] = useState(false);
  const { isTopUp, actionIsTopUp, actionIsConfirmTopUp, isConfirmTopup } =
    useActiveModal();

  const {
    nominals,
    selectedNominal,
    setSelectedNominal,
    parseSelectedNominal,
  } = useNominal();

  const { control, setValue } = useForm<FieldValues>();

  const handleOther = () => {
    setSelectedNominal("");
    setIsOtherField((v) => !v);
  };

  const handleNext = () => {
    if (!selectedNominal && !isOtherField) {
      toast.error("Pilih nominal top up");
      return;
    }

    actionIsTopUp();
    setTimeout(actionIsConfirmTopUp, 500);
  };

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
          <h2 className="text-center">Top Up Pilipay</h2>

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
                aria-label="kembali"
                className="w-full"
                variant="flat"
                onClick={handleOther}
              />
            )}
            <Button
              onClick={handleNext}
              aria-label="selanjutnya"
              className={cx("w-full", !isOtherField && "col-span-2")}
            />
          </section>
        </main>
      </Modal>

      <Confirm
        title="top up"
        onBack={onBack}
        isModal={isConfirmTopup}
        actionModal={actionIsConfirmTopUp}
        selectedNominal={parseSelectedNominal()}
      >
        Lorem ipsum dolor sit amet.
      </Confirm>
    </>
  );
};

export default Topup;
