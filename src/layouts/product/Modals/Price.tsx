import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";

const PriceModal = () => {
  const { isPrice, actionIsPrice } = useActiveModal();
  return (
    <Modal isOpen={isPrice} closeModal={actionIsPrice}>
      <main className="my-4 flexcol gap-6">Lorem, ipsum dolor.</main>
    </Modal>
  );
};

export default PriceModal;
