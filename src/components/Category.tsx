import cx from "classnames";
import { Modal } from "./Modal";
import { ActionModal, UseForm } from "src/types";
import { SubCategory } from "src/api/category.service";

interface ListingProps extends Pick<UseForm, "setValue" | "clearErrors"> {
  keyField: string;
  title: string;
  data?: SubCategory[];
  modal: ActionModal;
}

export function ListingModal({
  keyField,
  setValue,
  clearErrors,
  data,
  title,
  modal,
}: ListingProps) {
  const onClick = (id: string, name: string) => {
    setValue(keyField, name);
    clearErrors(keyField);
    // TODO: set id
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
}
