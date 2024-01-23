import { Dialog, Transition } from "@headlessui/react";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { Fragment } from "react";
import { modalDOM } from "src/helpers";

interface Modal {
  title: string;
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, closeModal, title, children }: Modal) => {
  return (
    <>
      {!modalDOM
        ? null
        : createPortal(
            <Transition appear show={isOpen} as={Fragment}>
              <Dialog
                as="section"
                className="relative z-20"
                onClose={closeModal}
              >
                <Transition.Child
                  as={Fragment}
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
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                        <Dialog.Title
                          as="h3"
                          className="text-lg font-interMedium leading-6 text-gray-900 capitalize"
                        >
                          {title}
                        </Dialog.Title>

                        {children}

                        <button
                          onClick={closeModal}
                          className="mt-4 absolute right-4 top-0 outline-none remove-highlight"
                          title="Tutup popup"
                        >
                          <XMarkIcon width={18} />
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
