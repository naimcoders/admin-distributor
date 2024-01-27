import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Textfield } from "src/components/Textfield";
import { IconColor } from "src/types";

const Detail = () => {
  const [isCreate, setIsCreate] = useState(false);
  const { handleSubmit, control, resetField } = useForm<FieldValues>();
  const name = "subCategory";

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

  return (
    <main className="bg-white rounded-md">
      <Header />

      <Listing
        label="Pendingin Ruangan"
        update={() => console.log("edit")}
        remove={() => console.log("delete")}
      />
      <Listing
        label="Lemari Es"
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
        classNames={{ inputWrapper: "px-5 rounded-b-md" }}
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
      />
    </main>
  );
};

export default Detail;

const Header = () => {
  return (
    <header className="border-b-2 border-gray-300 px-5 py-4 ">
      <h2 className="font-interBold">Elektronik</h2>
    </header>
  );
};

interface ListingProps {
  label: string;
  update: () => void;
  remove: () => void;
}

const Listing = ({ label, update, remove }: ListingProps) => {
  return (
    <section className="px-5 py-4 flex justify-between border-t border-gray-300 hover:bg-gray-100">
      <h2>{label}</h2>

      <section className="flex gap-5">
        <PencilIcon width={16} className="cursor-pointer" onClick={update} />
        <TrashIcon
          width={16}
          color={IconColor.red}
          className="cursor-pointer"
          onClick={remove}
        />
      </section>
    </section>
  );
};
