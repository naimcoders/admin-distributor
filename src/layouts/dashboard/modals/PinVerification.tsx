import { Modal } from "src/components/Modal";
import { ConfirmHeader } from "./Confirm";
import { useActiveModal } from "src/stores/modalStore";
import { FC } from "react";

interface Verificationprops {
  onBack: () => void;
}

const PinVerification: FC<Verificationprops> = ({ onBack }) => {
  const { actionIsPinVerification, isPinVerification } = useActiveModal();

  return (
    <Modal
      isOpen={isPinVerification}
      closeModal={actionIsPinVerification}
      customHeader={<ConfirmHeader onBack={onBack} title="verifikasi PIN" />}
    >
      <main>Form</main>
    </Modal>
  );
};

export default PinVerification;
