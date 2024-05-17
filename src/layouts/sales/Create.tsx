import {
  HiOutlineArrowUpTray,
  HiOutlineChevronRight,
  HiOutlineTrash,
} from "react-icons/hi2";
import { ChangeEvent, Fragment, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { ChildRef, File, LabelAndImage } from "src/components/File";
import { Modal } from "src/components/Modal";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { useActiveModal } from "src/stores/modalStore";
import { IconColor, UseForm } from "src/types";
import { handleErrorMessage } from "src/helpers";
import { Checkbox, CheckboxGroup } from "@nextui-org/react";
import useGeneralStore from "src/stores/generalStore";
import { GridInput } from "../Index";

const Create = () => {
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: "onChange",
  });
  const { fields } = useHook();

  const category = useGeneralStore((v) => v.category);

  const onSubmit = handleSubmit(async (e) => {
    try {
      console.log(e, category);
    } catch (e) {
      const error = e as Error;
      console.log(error);
    }
  });

  return (
    <main>
      <GridInput className="mt-2">
        {fields.map((v, idx) => (
          <Fragment key={idx}>
            {["text", "number", "email"].includes(v.type!) && (
              <Textfield
                type={v.type}
                label={v.label}
                control={control}
                name={v.name ?? ""}
                placeholder={v.placeholder}
                defaultValue={v.defaultValue}
                autoComplete={v.autoComplete}
                errorMessage={handleErrorMessage(errors, v.name)}
                rules={{
                  required: { value: true, message: v.errorMessage ?? "" },
                }}
                className="w-full"
              />
            )}

            {["modal"].includes(v.type!) && (
              <Textfield
                name={v.name!}
                label={v.label}
                control={control}
                onClick={v.onClick}
                readOnly={v.readOnly}
                placeholder={v.placeholder}
                defaultValue={v.defaultValue}
                autoComplete={v.autoComplete}
                endContent={<HiOutlineChevronRight size={16} />}
                errorMessage={handleErrorMessage(errors, v.name)}
                rules={{
                  required: { value: true, message: v.errorMessage ?? "" },
                }}
                className="w-full"
              />
            )}

            {["file"].includes(v.type!) &&
              (!v.defaultValue ? (
                <File
                  name={v.name}
                  label={v.label}
                  control={control}
                  className="w-full"
                  placeholder={v.placeholder}
                  ref={v.uploadImage?.file.ref}
                  onClick={v.uploadImage?.file.onClick}
                  onChange={v.uploadImage?.file.onChange}
                  startContent={<HiOutlineArrowUpTray size={16} />}
                  errorMessage={handleErrorMessage(errors, v.name)}
                  rules={{
                    required: { value: true, message: v.errorMessage ?? "" },
                  }}
                />
              ) : (
                <LabelAndImage src={v.defaultValue} label={v.label!} />
              ))}
          </Fragment>
        ))}
      </GridInput>

      <div className="flex justify-center mt-10">
        <Button label="simpan" onClick={onSubmit} />
      </div>

      <CategoryModal setValue={setValue} clearErrors={clearErrors} />
    </main>
  );
};

export const CategoryModal = ({
  setValue,
  clearErrors,
}: Pick<UseForm, "setValue" | "clearErrors">) => {
  const category = useGeneralStore((v) => v.category) as string[];
  const setCategory = useGeneralStore((v) => v.setCategory);
  const { isCategory, actionIsCategory } = useActiveModal();

  const data: string[] = [
    "Semua Kategori",
    "Alat & Mesin",
    "Bahan Bangunan",
    "Dapur",
  ];

  const key = "category";
  const onNext = () => {
    setValue(key, category.join(", "));
    clearErrors(key);
    actionIsCategory();
  };

  return (
    <Modal
      title="pilih kategori"
      isOpen={isCategory}
      closeModal={actionIsCategory}
    >
      <CheckboxGroup
        className="my-5"
        onChange={(e) => setCategory(e)}
        defaultValue={category}
      >
        {data.map((v) => (
          <Checkbox
            value={v}
            key={v}
            id={v}
            name={v}
            classNames={{ label: "text-sm" }}
            size="sm"
          >
            {v}
          </Checkbox>
        ))}
      </CheckboxGroup>

      <div className="flex justify-center">
        <Button label="selanjutnya" className="mx-auto" onClick={onNext} />
      </div>
    </Modal>
  );
};

export const useKtp = () => {
  const [ktpBlob, setKtpBlob] = useState("");
  const ktpRef = useRef<ChildRef>(null);

  const onClick = () => {
    if (ktpRef.current) ktpRef.current.click();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return null;
    const blob = URL.createObjectURL(files[0]);
    setKtpBlob(blob);
  };

  return { ktpBlob, ktpRef, onClick, onChange, setKtpBlob };
};

const useHook = () => {
  const { ktpBlob, ktpRef, onClick, onChange, setKtpBlob } = useKtp();
  const { actionIsCategory } = useActiveModal();

  const fields: TextfieldProps<FieldValues>[] = [
    objectFields({
      label: "nama sales",
      name: "salesName",
      type: "text",
      defaultValue: "",
      autoComplete: "on",
    }),
    objectFields({
      label: "nomor HP",
      name: "phoneNumber",
      type: "number",
      defaultValue: "",
      autoComplete: "on",
    }),
    objectFields({
      label: "email",
      name: "email",
      type: "email",
      defaultValue: "",
      autoComplete: "on",
    }),
    objectFields({
      label: "kategori",
      name: "category",
      type: "modal",
      defaultValue: "",
      placeholder: "pilih kategori sales",
      onClick: actionIsCategory,
      readOnly: { isValue: true, cursor: "cursor-pointer" },
    }),
    objectFields({
      label: "komisi penjualan (%)",
      name: "commission",
      type: "number",
      defaultValue: "",
      placeholder: "masukkan komisi",
    }),
    objectFields({
      label: "KTP sales",
      name: "ktp",
      type: "file",
      placeholder: "unggah KTP",
      defaultValue: ktpBlob,
      uploadImage: {
        file: {
          ref: ktpRef,
          onClick,
          onChange,
        },
        image: {
          actions: [
            {
              src: <HiOutlineTrash size={16} color={IconColor.red} />,
              onClick: () => setKtpBlob(""),
            },
          ],
        },
      },
    }),
  ];

  return { fields };
};

export default Create;
