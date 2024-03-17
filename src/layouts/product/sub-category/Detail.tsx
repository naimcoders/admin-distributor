import React from "react";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Textfield } from "src/components/Textfield";
import { IconColor } from "src/types";
import { useParams } from "react-router-dom";

const Detail = () => {
  const { categoryProductId } = useParams() as { categoryProductId: string };
  const name = "subCategory";

  const [isCreate, setIsCreate] = React.useState(false);
  const { handleSubmit, control, resetField, getValues } =
    useForm<FieldValues>();

  const activeBtnCreate = () => setIsCreate((prev) => !prev);
  const onSubmit = handleSubmit(async (e) => {
    try {
      if (!e?.[name]) throw new Error("Masukkan sub kategori");
      console.log(e);
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    } finally {
      resetField(name);
      setIsCreate((prev) => !prev);
    }
  });

  const onSubmitKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = getValues(name);
    if (e.key === "Escape") {
      setIsCreate((v) => !v);
    }

    if (e.key === "Enter") {
      try {
        if (!value) throw new Error("Masukkan sub kategori");
        console.log(value);
      } catch (e) {
        const error = e as Error;
        toast.error(error.message);
      }
    }
  };

  return (
    <main className="bg-white rounded-md">
      <header className="border-b-2 border-gray-300 p-4">
        <h2 className="font-interBold">Elektronik</h2>
      </header>

      <Listing
        label="Pendingin Ruangan"
        update={() => console.log("edit")}
        remove={() => console.log("delete")}
      />

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
  );
};

export default Detail;

interface ListingProps {
  label: string;
  update: () => void;
  remove: () => void;
}

const Listing = ({ label, update, remove }: ListingProps) => {
  return (
    <section className="p-4 flex justify-between border-t border-gray-300">
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
