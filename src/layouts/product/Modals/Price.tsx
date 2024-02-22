import { PencilIcon } from "@heroicons/react/24/outline";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { IconColor } from "src/types";

const PriceModal = () => {
  const { isPrice, actionIsPrice } = useActiveModal();
  return (
    <Modal isOpen={isPrice} closeModal={actionIsPrice}>
      <main className="my-4 flexcol gap-5">
        <header className="flex gap-4 justify-between">
          <h1 className="capitalize font-semibold">
            Atur harga variasi produk
          </h1>
          <button
            className={`text-[${IconColor.red}] text-sm capitalize hover:text-blue-500 inline-flex gap-1 items-center`}
            title="Edit secara massal"
          >
            <PencilIcon width={16} />
            massal
          </button>
        </header>
        <hr />
      </main>
    </Modal>
  );
};

export default PriceModal;
