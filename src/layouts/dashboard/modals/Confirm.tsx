import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";

const Confirm: FC<{ selectedNominal: string } & HeaderProps> = ({
  selectedNominal,
  title,
}) => {
  const { isConfirmPay, actionIsConfirmPay } = useActiveModal();
  const [nominal] = selectedNominal.split("k");

  return (
    <Modal
      isOpen={isConfirmPay}
      closeModal={actionIsConfirmPay}
      customHeader={<ConfirmHeader title={title} />}
    >
      <main>
        <section className="flexcol gap-1">
          <h2 className="capitalize">jumlah transfer</h2>
          <h2 className="font-semibold text-lg">Rp{nominal}.000</h2>
        </section>
      </main>
    </Modal>
  );
};

interface HeaderProps {
  title: "top up" | "transfer";
}

const ConfirmHeader: FC<HeaderProps> = ({ title }) => {
  const { actionIsConfirmPay, actionIsTransfer } = useActiveModal();
  const handleNav = () => {
    if (title === "transfer") {
      actionIsConfirmPay();
      setTimeout(actionIsTransfer, 500);
    }
  };

  return (
    <header className="flex mb-4">
      <nav
        className="border border-gray-400 rounded-lg flex p-1 cursor-pointer"
        onClick={handleNav}
      >
        <ChevronLeftIcon width={18} />
      </nav>
      <h1 className="capitalize text-center w-full text-lg font-semibold">
        konfirmasi {title}
      </h1>
    </header>
  );
};

export default Confirm;
