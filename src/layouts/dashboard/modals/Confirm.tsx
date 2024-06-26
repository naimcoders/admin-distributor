import { HiOutlineChevronLeft } from "react-icons/hi2";
import { FC, ReactNode } from "react";
import { Modal } from "src/components/Modal";
import { Currency } from "src/helpers";

interface ConfirmProps extends HeaderProps {
  isModal: boolean;
  actionModal: () => void;
  selectedNominal: number;
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
          <h2 className="font-semibold text-lg">
            Rp{Currency(selectedNominal)}
          </h2>
        </section>

        {children}
      </main>
    </Modal>
  );
};

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

export const ConfirmHeader: FC<HeaderProps> = ({ title, onBack }) => {
  return (
    <header className="flex border-b border-gray-300 pb-4 mb-4 relative">
      {onBack && (
        <nav
          className="border border-gray-400 rounded-lg flex p-1 cursor-pointer absolute top-0"
          onClick={onBack}
          title="Kembali"
        >
          <HiOutlineChevronLeft size={18} />
        </nav>
      )}
      <h1 className="capitalize text-center w-full text-lg font-semibold">
        {title}
      </h1>
    </header>
  );
};

export default Confirm;
