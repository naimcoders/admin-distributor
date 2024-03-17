import React from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Textfield } from "src/components/Textfield";
import { IconColor } from "src/types";
import { useParams } from "react-router-dom";
import { useSubCategoryProduct } from "src/api/sub-category-product.service";
import Error from "src/components/Error";
import Skeleton from "src/components/Skeleton";

const Detail = () => {
  const name = "subCategory";
  const { categoryProductId, categoryName } = useParams() as {
    categoryProductId: string;
    categoryName: string;
  };

  const [isCreate, setIsCreate] = React.useState(false);
  const { handleSubmit, control, reset, getValues } = useForm<{
    subCategory: string;
  }>();

  const { create, findById, remove } = useSubCategoryProduct(categoryProductId);

  const activeBtnCreate = () => setIsCreate((prev) => !prev);
  const onSubmit = handleSubmit(async (e) => {
    try {
      if (!e.subCategory) {
        toast.error("Masukkan sub-kategori");
        return;
      }
      console.log(e.subCategory);
    } catch (e) {
      const error = e as Error;
      console.error(`Something wrong to submit : ${error.message}`);
    } finally {
      reset();
      setIsCreate((prev) => !prev);
    }
  });

  const onSubmitKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = getValues(name);
    if (e.key === "Escape") setIsCreate((v) => !v);
    if (e.key === "Enter") {
      try {
        if (!value) {
          toast.error("Masukkan sub-kategori");
          return;
        }
        const obj = {
          name: value,
          categoryProductId,
        };

        await create.mutateAsync({ data: obj });
      } catch (e) {
        const error = e as Error;
        console.error(`Something wrong to submit : ${error.message}`);
      } finally {
        reset();
      }
    }
  };

  const onRemove = async (subCategoryId: string) => {
    try {
      await remove.mutateAsync({ subCategoryId });
    } catch (err) {
      const error = err as Error;
      console.error(`Something wrong to remove : ${error.message}`);
    }
  };

  return (
    <>
      {findById.error ? (
        <Error error={findById.error.message} />
      ) : findById.isLoading ? (
        <Skeleton />
      ) : (
        <main className="bg-white rounded-md">
          <header className="border-b-2 border-gray-300 p-4">
            <h2 className="font-interBold">{categoryName}</h2>
          </header>

          {findById.data?.map((v) => (
            <Listing
              key={v.id}
              label={v.name}
              update={() => console.log(`edit ${v.id}`)}
              remove={() => onRemove(v.id)}
            />
          ))}

          <Textfield
            name={name}
            radius="none"
            defaultValue=""
            control={control}
            onClick={activeBtnCreate}
            placeholder="tambah sub-kategori"
            readOnly={{ isValue: !isCreate, cursor: "cursor-pointer" }}
            startContent={
              !isCreate && <PlusIcon width={16} color={IconColor.zinc} />
            }
            endContent={
              isCreate && (
                <CheckIcon
                  width={16}
                  color={IconColor.green}
                  className="cursor-pointer"
                  onClick={onSubmit}
                />
              )
            }
            onKeyDown={onSubmitKeyDown}
          />
        </main>
      )}
    </>
  );
};

interface ListingProps {
  label: string;
  update: () => void;
  remove: () => void;
}

const Listing = ({ label, update, remove }: ListingProps) => {
  return (
    <section className="px-4 py-3 flex justify-between border-t border-gray-300">
      <h2>{label}</h2>

      <section className="flex gap-5">
        <PencilIcon width={16} className="cursor-pointer" onClick={update} />
        <TrashIcon
          width={16}
          onClick={remove}
          color={IconColor.red}
          className="cursor-pointer"
        />
      </section>
    </section>
  );
};

export default Detail;
