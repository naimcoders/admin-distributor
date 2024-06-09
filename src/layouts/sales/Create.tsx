import {
  HiOutlineArrowUpTray,
  HiOutlineChevronRight,
  HiOutlineTrash,
} from "react-icons/hi2";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { ChildRef, File, LabelAndImage } from "src/components/File";
import { Modal } from "src/components/Modal";
import { Textfield } from "src/components/Textfield";
import { useActiveModal } from "src/stores/modalStore";
import { IconColor, UseForm } from "src/types";
import { handleErrorMessage, setRequiredField } from "src/helpers";
import { Checkbox, CheckboxGroup, Spinner } from "@nextui-org/react";
import { findCategories } from "src/api/category.service";
import Error from "src/components/Error";

interface IDefaultValues {
  comition: string;
  name: string;
  phoneNumber: string;
  email: string;
  category: string;
}

const Create = () => {
  const [categories, setCategories] = React.useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<IDefaultValues>();

  const { actionIsCategory } = useActiveModal();
  const {
    ktpBlob,
    ktpRef,
    onClick,
    onChange,
    setKtpBlob,
    ktpFiles,
    setKtpFiles,
  } = useKtp();

  const onSubmit = handleSubmit(async (e) => {
    try {
      console.log(e, ktpFiles, categories);
      setKtpFiles(undefined);
    } catch (e) {
      const error = e as Error;
      console.error(error);
    }
  });

  return (
    <main>
      <section className="grid grid-cols-4 lg:gap-8 gap-4">
        <Textfield
          type="text"
          label="nama sales"
          control={control}
          name="name"
          placeholder="Masukkan nama sales"
          defaultValue=""
          errorMessage={handleErrorMessage(errors, "name")}
          rules={{ required: setRequiredField(true, "Masukkan nama sales") }}
          className="w-full"
        />

        <Textfield
          type="number"
          label="nomor HP"
          control={control}
          name="phoneNumber"
          placeholder="Masukkan nomor HP sales"
          defaultValue=""
          errorMessage={handleErrorMessage(errors, "phoneNumber")}
          rules={{ required: setRequiredField(true, "Masukkan nomor HP") }}
          className="w-full"
        />

        <Textfield
          type="email"
          label="email"
          control={control}
          name="email"
          autoComplete="on"
          placeholder="Masukkan alamat email"
          defaultValue=""
          errorMessage={handleErrorMessage(errors, "email")}
          rules={{ required: setRequiredField(true, "masukkan email") }}
          className="w-full"
        />

        <Textfield
          label="kategori"
          control={control}
          name="category"
          placeholder="pilih kategori sales"
          defaultValue=""
          errorMessage={handleErrorMessage(errors, "category")}
          rules={{ required: setRequiredField(true, "pilih kategori") }}
          className="w-full"
          readOnly={{ isValue: true, cursor: "cursor-pointer" }}
          onClick={actionIsCategory}
          endContent={<HiOutlineChevronRight size={16} />}
        />

        {!ktpBlob ? (
          <File
            name="ktp"
            label="KTP"
            control={control}
            placeholder="unggah KTP"
            ref={ktpRef}
            onClick={onClick}
            onChange={onChange}
            startContent={<HiOutlineArrowUpTray size={16} />}
          />
        ) : (
          <LabelAndImage
            src={ktpBlob}
            label="KTP"
            actions={[
              {
                src: <HiOutlineTrash size={16} color={IconColor.red} />,
                onClick: () => setKtpBlob(""),
              },
            ]}
          />
        )}
      </section>

      <Button
        label="simpan"
        onClick={onSubmit}
        className="mx-auto block mt-14"
      />

      <CategoryModal
        setValue={setValue}
        clearErrors={clearErrors}
        categories={categories}
        setCategories={setCategories}
      />
    </main>
  );
};

interface ICategory extends Pick<UseForm, "setValue" | "clearErrors"> {
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  categories: string[];
}

export const CategoryModal = ({
  setValue,
  clearErrors,
  categories,
  setCategories,
}: ICategory) => {
  const { isCategory, actionIsCategory } = useActiveModal();
  const categoryApi = findCategories();

  const key = "category";

  const onNext = () => {
    if (!categoryApi.data) return;
    let category: string[] = [];

    categoryApi.data.filter((e) => {
      categories.forEach((f) => {
        if (f === e.id) {
          category.push(e.name);
        }
      });
    });

    setValue(key, category.join(", "));
    clearErrors(key);
    actionIsCategory();
    category = [];
  };

  return (
    <Modal
      title="pilih kategori"
      isOpen={isCategory}
      closeModal={actionIsCategory}
    >
      {categoryApi.error && <Error error={categoryApi.error} />}
      {categoryApi.isLoading ? (
        <Spinner size="sm" />
      ) : (
        <CheckboxGroup
          className="my-5"
          value={categories}
          onValueChange={setCategories}
        >
          {categoryApi.data?.map((v) => (
            <Checkbox
              key={v.id}
              value={v.id}
              name={v.name}
              classNames={{ label: "text-sm" }}
              size="sm"
            >
              {v.name}
            </Checkbox>
          ))}
        </CheckboxGroup>
      )}

      <Button label="selanjutnya" className="mx-auto block" onClick={onNext} />
    </Modal>
  );
};

export const useKtp = () => {
  const [ktpBlob, setKtpBlob] = React.useState("");
  const [ktpFiles, setKtpFiles] = React.useState<FileList>();
  const ktpRef = React.useRef<ChildRef>(null);

  const onClick = () => {
    if (ktpRef.current) ktpRef.current.click();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setKtpFiles(files);
    const blob = URL.createObjectURL(files[0]);
    setKtpBlob(blob);
  };

  return {
    ktpBlob,
    ktpRef,
    onClick,
    onChange,
    setKtpBlob,
    setKtpFiles,
    ktpFiles,
  };
};

export default Create;
