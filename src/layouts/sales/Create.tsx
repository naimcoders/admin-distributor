import {
  HiOutlineArrowUpTray,
  HiOutlineChevronRight,
  HiOutlineTrash,
} from "react-icons/hi2";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { ChildRef, File, LabelAndImage } from "src/components/File";
import { Modal } from "src/components/Modal";
import { Textfield } from "src/components/Textfield";
import { IconColor } from "src/types";
import {
  handleErrorMessage,
  parsePhoneNumber,
  setRequiredField,
} from "src/helpers";
import { Checkbox, CheckboxGroup, Spinner } from "@nextui-org/react";
import { Category, findCategories } from "src/api/category.service";
import { uploadFile } from "src/firebase/upload";
import { toast } from "react-toastify";
import { createSales } from "src/api/sales.service";

interface IDefaultValues {
  comition: string;
  name: string;
  phoneNumber: string;
  email: string;
  category: string;
}

const Create = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryModal, setIsCategoryModal] = useState(false);
  const [pickCategories, setPickCategories] = React.useState<string[]>([]);

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<IDefaultValues>();

  const {
    ktpBlob,
    ktpRef,
    onClick,
    onChange,
    setKtpBlob,
    ktpFiles,
    setKtpFiles,
  } = useKtp();

  const findAllCategories = findCategories();
  const createNewSales = createSales();

  const onNext = () => {
    if (!findAllCategories.data) return;
    let category: string[] = [];

    findAllCategories.data.filter((e) => {
      pickCategories.forEach((f) => {
        if (f === e.id) {
          category.push(e.name);
        }
      });
    });

    setValue("category", category.join(", "));
    clearErrors("category");
    onCloseModal();
    category = [];
  };

  const onSubmit = handleSubmit(async (e) => {
    if (!ktpFiles) return;

    try {
      setIsLoading(true);
      const comition = Number(e.comition);
      const fileName = `temp/${Date.now()}.png`;
      const phoneNumber = parsePhoneNumber(e.phoneNumber);

      await uploadFile({ file: ktpFiles, prefix: fileName });
      await createNewSales.mutateAsync({
        ktpImagePath: fileName,
        comition,
        email: e.email,
        name: e.name,
        phoneNumber,
        categoryId: pickCategories,
      });

      toast.success("Sales berhasil dibuat");
      setKtpFiles(undefined);
      reset();
      setKtpBlob("");
    } catch (e) {
      toast.error("Gagal membuat sales");
    } finally {
      setIsLoading(false);
    }
  });

  const onCloseModal = () => setIsCategoryModal((v) => !v);

  return (
    <main>
      <section className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-2 lg:gap-8 gap-4">
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
          onClick={onCloseModal}
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
            errorMessage={handleErrorMessage(errors, "ktp")}
            rules={{ required: setRequiredField(true, "unggah KTP") }}
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

        <Textfield
          label="komisi penjualan (%)"
          control={control}
          name="comition"
          placeholder="masukkan komisi"
          defaultValue=""
          errorMessage={handleErrorMessage(errors, "comition")}
          rules={{ required: setRequiredField(true, "masukkan komisi") }}
          className="w-full"
        />
      </section>

      <Button
        label={
          isLoading || createNewSales.isLoading ? (
            <Spinner color="secondary" size="sm" />
          ) : (
            "simpan"
          )
        }
        onClick={onSubmit}
        className="mx-auto block mt-14"
      />

      <OptionCategoryModal
        value={pickCategories}
        setCategories={setPickCategories}
        data={findAllCategories.data ?? []}
        isOpenModal={isCategoryModal}
        onCloseModal={onCloseModal}
        onNext={onNext}
      />
    </main>
  );
};

interface ICategory {
  data: Category[];
  isOpenModal: boolean;
  onCloseModal: () => void;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  value: string[];
  onNext: () => void;
  defaultValue?: string[];
}

export const OptionCategoryModal = (props: ICategory) => {
  return (
    <Modal
      title="pilih kategori"
      isOpen={props.isOpenModal}
      closeModal={props.onCloseModal}
    >
      {props.data.length < 1 ? (
        <Spinner size="sm" />
      ) : (
        <CheckboxGroup
          className="my-5"
          value={props.value}
          onValueChange={props.setCategories}
        >
          {props.data?.map((v) => (
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

      <Button
        label="selanjutnya"
        className="mx-auto block"
        onClick={props.onNext}
      />
    </Modal>
  );
};

export const useKtp = () => {
  const [ktpBlob, setKtpBlob] = React.useState("");
  const [ktpFiles, setKtpFiles] = React.useState<File>();
  const ktpRef = React.useRef<ChildRef>(null);

  const onClick = () => {
    if (ktpRef.current) ktpRef.current.click();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setKtpFiles(files[0]);
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
