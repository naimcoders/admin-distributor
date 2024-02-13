import cx from "classnames";
import { Modal } from "./Modal";
import { ActionModal, UseForm } from "src/types";

interface ListingProps extends Pick<UseForm, "setValue" | "clearErrors"> {
  keyField: string;
  title: string;
  // data?: SubCategory[];
  data?: string[];
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
  // const onClick = (id: string, name: string) => {
  //   setValue(keyField, name);
  //   clearErrors(keyField);
  //   // TODO: set id
  //   console.log(id, name);
  //   modal.close();
  // };
  const onClick = (name: string) => {
    setValue(keyField, name);
    clearErrors(keyField);

    modal.close();
  };

  return (
    <Modal title={title} isOpen={modal.open} closeModal={modal.close}>
      <ul className="flex flex-col gap-2 my-4">
        {data?.sort().map((v) => (
          <li
            key={v}
            className={cx("hover:font-interBold cursor-pointer w-max")}
            // onClick={() => onClick(v.id, v.name)}
            onClick={() => onClick(v)}
          >
            {v}
          </li>
        ))}
      </ul>
    </Modal>
  );
}
