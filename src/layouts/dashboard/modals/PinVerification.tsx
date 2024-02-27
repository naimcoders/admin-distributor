import { Modal } from "src/components/Modal";
import { ConfirmHeader } from "./Confirm";
import { useActiveModal } from "src/stores/modalStore";

const PinVerification = () => {
  const { actionIsPinVerification, isPinVerification, actionIsConfirmPay } =
    useActiveModal();

  const onBack = () => {
    actionIsPinVerification();
    setTimeout(actionIsConfirmPay, 500);
  };

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
