import { FC } from "react";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";

const Confirm: FC<{ selectedNominal: string }> = ({ selectedNominal }) => {
  const { isConfirmPay, actionIsConfirmPay } = useActiveModal();

  return (
    <Modal isOpen={isConfirmPay} closeModal={actionIsConfirmPay}>
      {selectedNominal}
    </Modal>
  );
};

export default Confirm;
