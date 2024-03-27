import { Modal } from "src/components/Modal";
import { ConfirmHeader } from "./Confirm";
import { useActiveModal } from "src/stores/modalStore";
import React from "react";
import { useForm } from "react-hook-form";
import { Textfield } from "src/components/Textfield";

interface Verificationprops {
  header: { label: string; onBack?: () => void };
}

interface DefaultValues {
  input1: string;
  input2: string;
  input3: string;
  input4: string;
  input5: string;
  input6: string;
}

const PinVerification: React.FC<Verificationprops> = ({ header }) => {
  const { actionIsPinVerification, isPinVerification } = useActiveModal();
  const { control } = useForm<DefaultValues>();

  return (
    <Modal
      isOpen={isPinVerification}
      closeModal={actionIsPinVerification}
      customHeader={
        <ConfirmHeader onBack={header.onBack} title={header.label} />
      }
    >
      <main className="grid grid-cols-6 gap-4 my-4">
        <Textfield
          name="input1"
          control={control}
          defaultValue=""
          className="border border-gray-300 rounded-md"
          classNames={{ input: "text-center" }}
        />
        <Textfield
          name="input2"
          control={control}
          defaultValue=""
          className="border border-gray-300 rounded-md"
          classNames={{ input: "text-center" }}
        />
        <Textfield
          name="input3"
          control={control}
          defaultValue=""
          className="border border-gray-300 rounded-md"
          classNames={{ input: "text-center" }}
        />
        <Textfield
          name="input4"
          control={control}
          defaultValue=""
          className="border border-gray-300 rounded-md"
          classNames={{ input: "text-center" }}
        />
        <Textfield
          name="input5"
          control={control}
          defaultValue=""
          className="border border-gray-300 rounded-md"
          classNames={{ input: "text-center" }}
        />
        <Textfield
          name="input6"
          control={control}
          defaultValue=""
          className="border border-gray-300 rounded-md"
          classNames={{ input: "text-center" }}
        />
      </main>
    </Modal>
  );
};

export default PinVerification;
