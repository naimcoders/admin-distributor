import React from "react";
import cx from "classnames";
import { Dialog, Transition } from "@headlessui/react";
import { createPortal } from "react-dom";
import { HiOutlineX } from "react-icons/hi";
import { useActiveModal } from "src/stores/modalStore";
import { Button } from "./Button";

interface Modal {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  customHeader?: React.ReactNode;
  title?: string | React.ReactNode;
  width?: string;
}

export const Modal = ({
  isOpen,
  closeModal,
  title,
  children,
  customHeader,
  width,
}: Modal) => {
  const modalDOM = document.querySelector("#modal");
  if (!modalDOM || !isOpen) return null;

  return (
    <>
      {createPortal(
        <Transition appear show={isOpen} as={React.Fragment}>
          <Dialog as="section" className="relative z-20" onClose={closeModal}>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center relative">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel
                    className={cx(
                      "w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all",
                      width
                    )}
                  >
                    {!customHeader && title ? (
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-interMedium leading-6 text-gray-900 capitalize"
                      >
                        {title}
                      </Dialog.Title>
                    ) : (
                      customHeader
                    )}

                    {children}

                    <button
                      onClick={closeModal}
                      className="mt-4 absolute right-4 top-0 outline-none remove-highlight"
                      title="Tutup popup"
                    >
                      <HiOutlineX width={18} />
                    </button>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>,
        modalDOM
      )}
    </>
  );
};

interface ConfirmModalProps {
  label: string;
  onSubmit: {
    label: string;
    action: () => void;
  };
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  onSubmit,
  label,
}) => {
  const { isConfirm, actionIsConfirm } = useActiveModal();
  return (
    <Modal isOpen={isConfirm} closeModal={actionIsConfirm}>
      <section className="my-2 flex flex-col lg:gap-6 gap-4 items-center">
        <p>{label}</p>
        <Button label={onSubmit.label} onClick={onSubmit.action} />
      </section>
    </Modal>
  );
};
