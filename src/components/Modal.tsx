import cx from "classnames";
import { ActionModal, UseForm } from "src/types";
import { FC } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { Fragment } from "react";
import { modalDOM } from "src/helpers";
import { useActiveModal } from "src/stores/modalStore";
import Coordinate from "./Coordinate";
import { Category } from "src/api/category.service";

interface Modal {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  customHeader?: React.ReactNode;
  title?: string | React.ReactNode;
}

export const Modal = ({
  isOpen,
  closeModal,
  title,
  children,
  customHeader,
}: Modal) => {
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

interface CategoryLoopProps extends Pick<UseForm, "setValue" | "clearErrors"> {
  keyField: string;
  title: string;
  id: string;
  setId: (id: string) => void;
  modal: ActionModal;
  data?: Category[];
}

export const ListingDataModal: FC<CategoryLoopProps> = ({
  keyField,
  setValue,
  clearErrors,
  data,
  title,
  modal,
  setId,
  id,
}) => {
  const onClick = (id: string, name: string) => {
    setId(id);
    setValue(keyField, name);
    clearErrors(keyField);
    modal.close();
  };

  return (
    <Modal title={title} isOpen={modal.open} closeModal={modal.close}>
      <ul className="flex flex-col gap-2 my-4">
        {data?.map((v) => (
          <li
            key={v.id}
            onClick={() => onClick(v.id, v.name)}
            className={cx(
              "hover:font-bold cursor-pointer w-max",
              v.id === id && "font-bold"
            )}
          >
            {v.name}
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export const CoordinateModal = () => {
  const { isCoordinate, actionIsCoordinate } = useActiveModal();

  return (
    <Modal
      title="koordinat usaha"
      isOpen={isCoordinate}
      closeModal={actionIsCoordinate}
    >
      <main className="my-4">
        <Coordinate />
      </main>
    </Modal>
  );
};
