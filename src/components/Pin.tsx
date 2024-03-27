import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import React from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { Textfield } from "src/components/Textfield";
import { Button } from "src/components/Button";
import { ConfirmHeader } from "src/layouts/dashboard/modals/Confirm";

interface Verificationprops {
  header: { label: string; onBack?: () => void };
}

interface PinValues {
  input1: string;
  input2: string;
  input3: string;
  input4: string;
  input5: string;
  input6: string;
}

const numbers: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

interface TextfieldPin {
  forms: UseFormReturn<PinValues, any, undefined>;
  label?: string;
}

const TextfieldPin: React.FC<TextfieldPin> = ({ forms, label }) => {
  return (
    <main className="flex flex-col gap-2">
      {label && <h2>{label}</h2>}
      <section className="grid grid-cols-6 gap-4">
        <Textfield
          name="input1"
          control={forms.control}
          defaultValue=""
          onKeyDown={(e) => {
            if (numbers.includes(e.key)) {
              setTimeout(() => forms.setFocus("input2"), 100);
            }
          }}
          className="border border-gray-300 rounded-md"
          classNames={{ input: "text-center" }}
          type="number"
        />
        <Textfield
          name="input2"
          control={forms.control}
          defaultValue=""
          className="border border-gray-300 rounded-md"
          classNames={{ input: "text-center" }}
          type="number"
          onKeyDown={(e) => {
            if (numbers.includes(e.key)) {
              setTimeout(() => forms.setFocus("input3"), 100);
            }
          }}
        />
        <Textfield
          name="input3"
          control={forms.control}
          defaultValue=""
          className="border border-gray-300 rounded-md"
          classNames={{ input: "text-center" }}
          type="number"
          onKeyDown={(e) => {
            if (numbers.includes(e.key)) {
              setTimeout(() => forms.setFocus("input4"), 100);
            }
          }}
        />
        <Textfield
          name="input4"
          control={forms.control}
          defaultValue=""
          className="border border-gray-300 rounded-md"
          classNames={{ input: "text-center" }}
          type="number"
          onKeyDown={(e) => {
            if (numbers.includes(e.key)) {
              setTimeout(() => forms.setFocus("input5"), 100);
            }
          }}
        />
        <Textfield
          name="input5"
          control={forms.control}
          defaultValue=""
          className="border border-gray-300 rounded-md"
          classNames={{ input: "text-center" }}
          type="number"
          onKeyDown={(e) => {
            if (numbers.includes(e.key)) {
              setTimeout(() => forms.setFocus("input6"), 100);
            }
          }}
        />
        <Textfield
          name="input6"
          control={forms.control}
          defaultValue=""
          className="border border-gray-300 rounded-md"
          classNames={{ input: "text-center" }}
          type="number"
        />
      </section>
    </main>
  );
};

export const CreateNewPin: React.FC<Verificationprops> = ({ header }) => {
  const { actionIsCreatePin, isCreatePin } = useActiveModal();
  const formCreate = useForm<PinValues>();
  const formConfirm = useForm<PinValues>();

  const onSubmit = () => {
    const ct = formCreate.getValues();
    const cm = formConfirm.getValues();
    console.log({ ct, cm });
  };

  return (
    <Modal
      isOpen={isCreatePin}
      closeModal={actionIsCreatePin}
      customHeader={
        <ConfirmHeader onBack={header.onBack} title={header.label} />
      }
    >
      <main className="flex flex-col gap-5">
        <TextfieldPin forms={formCreate} label="PIN Baru" />
        <TextfieldPin forms={formConfirm} label="Konfirmasi PIN" />
        <Button
          aria-label="simpan"
          className="mx-auto mt-5 mb-2"
          onClick={onSubmit}
        />
      </main>
    </Modal>
  );
};
