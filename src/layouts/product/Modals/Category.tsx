import { FC } from "react";
import { useCategory } from "src/api/category.service";
import { ListingDataModal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { UseForm } from "src/types";

interface ModalCategoryProps extends Pick<UseForm, "setValue" | "clearErrors"> {
  id: string;
  setId: (val: string) => void;
}

export const ModalCategory: FC<ModalCategoryProps> = ({
  clearErrors,
  setValue,
  id,
  setId,
}) => {
  const { isCategory, actionIsCategory } = useActiveModal();
  const { data } = useCategory().find();

  const sortCategories = data?.sort((a, b) => a.name?.localeCompare(b.name));

  return (
    <ListingDataModal
      id={id}
      title="kategori"
      keyField="category"
      data={sortCategories}
      setValue={setValue}
      clearErrors={clearErrors}
      setId={setId}
      modal={{
        open: isCategory,
        close: actionIsCategory,
      }}
    />
  );
};

export const ModalSubCategory: FC<ModalCategoryProps> = ({
  clearErrors,
  setValue,
  id,
  setId,
}) => {
  const { isSubCategory, actionIsSubCategory } = useActiveModal();
  const { data } = useCategory().find();

  const sortCategories = data?.sort((a, b) => a.name?.localeCompare(b.name));

  return (
    <ListingDataModal
      id={id}
      title="sub-kategori"
      keyField="subCategory"
      data={sortCategories}
      setValue={setValue}
      clearErrors={clearErrors}
      setId={setId}
      modal={{
        open: isSubCategory,
        close: actionIsSubCategory,
      }}
    />
  );
};
