import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, Fragment, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { ChildRef, InputFile } from "src/components/File";
import { Modal } from "src/components/Modal";
import {
  PartialGeneralFields,
  Textfield,
  objectFields,
} from "src/components/Textfield";
import { useActiveModal } from "src/stores/modalStore";
import { UseForm } from "src/types";
import { handleErrorMessage } from "src/helpers";
import { Checkbox, CheckboxGroup } from "@nextui-org/react";
import useGeneralStore from "src/stores/generalStore";

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
      <div className="grid-min-300 gap-6">
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
                endContent={<ChevronRightIcon width={16} />}
                errorMessage={handleErrorMessage(errors, v.name)}
                rules={{
                  required: { value: true, message: v.errorMessage ?? "" },
                }}
              />
            )}

            {["file"].includes(v.type!) && (
              <InputFile
                label={v.label!}
                blob={String(v.defaultValue)}
                file={{
                  ref: v.refs?.ref!,
                  onChange: v.refs?.onChange,
                  onClick: v.refs?.onClick,
                  btnLabel: v.placeholder!,
                }}
                icons={[
                  {
                    src: <TrashIcon width={16} />,
                    onClick: v.deleteImage,
                  },
                ]}
              />
            )}
          </Fragment>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Button aria-label="simpan" onClick={onSubmit} />
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
        <Button aria-label="selanjutnya" className="mx-auto" onClick={onNext} />
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

  const fields: PartialGeneralFields[] = [
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
      type: "text",
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
      refs: {
        ref: ktpRef,
        onClick,
        onChange,
      },
      defaultValue: ktpBlob,
      deleteImage: () => setKtpBlob(""),
    }),
  ];

  return { fields };
};

export default Create;
