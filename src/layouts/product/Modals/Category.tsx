import cx from "classnames";
import { FC } from "react";
import { useProductCategory } from "src/api/product-category.service";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { UseForm } from "src/types";

interface ModalCategoryProps extends Pick<UseForm, "setValue" | "clearErrors"> {
  id: string;
  setId: (val: string) => void;
  categoryId?: string;
}

interface IListingModal<T extends object> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  render: (data: T) => React.ReactNode;
  data?: T;
}

export const ListingModal = <T extends object>(props: IListingModal<T>) => {
  return (
    <Modal title={props.title} isOpen={props.isOpen} closeModal={props.onClose}>
      {props.data && (
        <ul className="flex flex-col gap-2 my-4">{props.render(props.data)}</ul>
      )}
    </Modal>
  );
};

export const ModalSubCategory: FC<ModalCategoryProps> = ({
  clearErrors,
  setValue,
  id,
  setId,
  categoryId,
}) => {
  const { isSubCategory, actionIsSubCategory } = useActiveModal();
  const productCategory = useProductCategory().find();

  const filterByCategoryId = productCategory.data?.filter(
    (category) => category.category.id === categoryId
  );

  const key = "subCategory";
  const onClick = (id: string, name: string) => {
    setId(id);
    clearErrors(key);
    setValue(key, name);
    actionIsSubCategory();
  };

  return (
    <Modal
      title="sub kategori"
      isOpen={isSubCategory}
      closeModal={actionIsSubCategory}
    >
      {Number(filterByCategoryId?.length) < 1 ? (
        <h2 className="font-semibold text-lg text-center my-4">
          Tidak ada sub-kategori
        </h2>
      ) : (
        <ul className="flex flex-col gap-2 my-4">
          {filterByCategoryId?.map((v) =>
            v.subCategory.length < 1 ? (
              <h2 className="font-semibold text-lg text-center" key={v.id}>
                Tidak ada sub-kategori
              </h2>
            ) : (
              v.subCategory.map((e) => (
                <li
                  key={e.id}
                  onClick={() => onClick(e.id, e.name)}
                  className={cx(
                    "hover:font-bold cursor-pointer w-max",
                    e.id === id && "font-bold"
                  )}
                >
                  {e.name}
                </li>
              ))
            )
          )}
        </ul>
      )}
    </Modal>
  );
};
