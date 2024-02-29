import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { FC, ReactNode } from "react";
import { Modal } from "src/components/Modal";

interface ConfirmProps extends HeaderProps {
  isModal: boolean;
  actionModal: () => void;
  selectedNominal: string;
  children?: ReactNode;
}

const Confirm: FC<ConfirmProps> = ({
  selectedNominal,
  title,
  children,
  onBack,
  isModal,
  actionModal,
}) => {
  return (
    <Modal
      isOpen={isModal}
      closeModal={actionModal}
      customHeader={<ConfirmHeader title={title} onBack={onBack} />}
    >
      <main className="flexcol gap-4">
        <section className="flexcol gap-1">
          <h2 className="capitalize">jumlah transfer</h2>
          <h2 className="font-semibold text-lg">Rp{selectedNominal}</h2>
        </section>

        {children}
      </main>
    </Modal>
  );
};

interface HeaderProps {
  title: string;
  onBack: () => void;
}

export const ConfirmHeader: FC<HeaderProps> = ({ title, onBack }) => {
  return (
    <header className="flex border-b border-gray-300 pb-4 mb-4 relative">
      <nav
        className="border border-gray-400 rounded-lg flex p-1 cursor-pointer absolute top-0"
        onClick={onBack}
        title="Kembali"
      >
        <ChevronLeftIcon width={18} />
      </nav>
      <h1 className="capitalize text-center w-full text-lg font-semibold">
        Konfirmasi {title}
      </h1>
    </header>
  );
};

export default Confirm;
