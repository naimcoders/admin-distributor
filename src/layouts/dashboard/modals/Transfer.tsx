import cx from "classnames";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { BeginHeader } from "./History";
import { Textfield } from "src/components/Textfield";
import ContentTextfield from "src/components/ContentTextfield";
import { CurrencyIDInput } from "src/helpers";
import { Button } from "src/components/Button";
import Confirm from "./Confirm";

const Transfer = () => {
  const [isOtherField, setIsOtherField] = useState(false);
  const { isTransfer, actionIsTransfer, actionIsConfirmPay } = useActiveModal();
  const { nominals, selectedNominal, setSelectedNominal } = useNominal();
  const { control, setValue } = useForm<FieldValues>();

  const handleOther = () => {
    setSelectedNominal("");
    setIsOtherField((v) => !v);
  };

  const handleNext = () => {
    if (!selectedNominal && !isOtherField) {
      toast.error("Pilih nominal transfer");
      return;
    }

    actionIsTransfer();
    setTimeout(actionIsConfirmPay, 500);
  };

  return (
    <>
      <Modal
        isOpen={isTransfer}
        closeModal={actionIsTransfer}
        customHeader={<BeginHeader />}
      >
        <main className="my-4 border-t border-gray-300 pt-4 flexcol gap-4">
          <h2 className="text-center">Transfer Pilipay</h2>

          {!isOtherField && (
            <section className="grid grid-cols-2 gap-4">
              {nominals.map((v) => (
                <section
                  key={v.label}
                  onClick={() => v.onClick(v.label)}
                  className={cx(
                    "border border-gray-400 text-center py-2 rounded-xl cursor-pointer hover:bg-gray-200",
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
      <Confirm selectedNominal={selectedNominal} title="transfer">
        <section className="border-t border-gray-300 py-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta,
          explicabo.
        </section>
      </Confirm>
    </>
  );
};

interface NominalProps {
  label: string;
  onClick: (nominal: string) => void;
}

const useNominal = () => {
  const [selectedNominal, setSelectedNominal] = useState("");
  const handleNominal = (nominal: string) => setSelectedNominal(nominal);

  const nominals: NominalProps[] = [
    { label: "50k", onClick: handleNominal },
    { label: "100k", onClick: handleNominal },
    { label: "200k", onClick: handleNominal },
    { label: "500k", onClick: handleNominal },
  ];

  return { nominals, selectedNominal, setSelectedNominal };
};

export default Transfer;
