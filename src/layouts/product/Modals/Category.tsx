import { FC } from "react";
import { useCategory } from "src/api/category.service";
import { ListingDataModal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { UseForm } from "src/types";

interface ModalCategoryProps extends Pick<UseForm, "setValue" | "clearErrors"> {
  setCategoryId: (val: string) => void;
}

export const ModalCategory: FC<ModalCategoryProps> = ({
  clearErrors,
  setValue,
  setCategoryId,
}) => {
  const { isCategory, actionIsCategory } = useActiveModal();
  const categories = useCategory().findAll();

  const sortCategories = categories.data?.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <>
      <ListingDataModal
        title="kategori"
        keyField="category"
        data={sortCategories}
        setValue={setValue}
        clearErrors={clearErrors}
        setId={setCategoryId}
        modal={{
          open: isCategory,
          close: actionIsCategory,
        }}
      />
    </>
  );
};
