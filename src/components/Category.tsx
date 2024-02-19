import cx from "classnames";
import { Modal } from "./Modal";
import { ActionModal, UseForm } from "src/types";
import { SubCategory } from "src/api/category.service";
import { FC } from "react";

interface ListingProps extends Pick<UseForm, "setValue" | "clearErrors"> {
  keyField: string;
  title: string;
  setId: (id: string) => void;
  modal: ActionModal;
  data?: SubCategory[];
}

export const ListingModal: FC<ListingProps> = ({
  keyField,
  setValue,
  clearErrors,
  data,
  title,
  modal,
  setId,
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
            className={cx("hover:font-interBold cursor-pointer w-max")}
            onClick={() => onClick(v.id, v.name)}
          >
            {v.name}
          </li>
        ))}
      </ul>
    </Modal>
  );
};
