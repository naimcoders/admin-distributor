import ktp from "src/assets/images/ktp.png";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { FieldValues, useForm } from "react-hook-form";
import {
  PartialGeneralFields,
  Textfield,
  objectFields,
} from "src/components/Textfield";
import { useActiveModal } from "src/stores/modalStore";
import { CategoryModal, useKtp } from "../Create";
import { InputFile } from "src/components/File";
import Image from "src/components/Image";
import { GridInput } from "src/layouts/Index";

const Profile = () => {
  const {
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: "onChange",
  });
  const { fields } = useHook();

  return (
    <GridInput className="mt-5">
      {fields.map((v, idx) => (
        <Fragment key={idx}>
          {["text", "number", "email"].includes(v.type!) && (
            <Textfield
              label={v.label}
              control={control}
              name={v.name ?? ""}
              placeholder={v.placeholder}
              defaultValue={v.defaultValue}
              autoComplete={v.autoComplete}
              readOnly={v.readOnly}
              description={v.description}
            />
          )}

          {["modal"].includes(v.type!) && (
            <Textfield
              name={v.name!}
              autoComplete={v.autoComplete}
              control={control}
              defaultValue={v.defaultValue}
              placeholder={v.placeholder}
              readOnly={v.readOnly}
              type="text"
              label={v.label}
              endContent={<ChevronRightIcon width={16} />}
              onClick={v.onClick}
            />
          )}

          {["file"].includes(v.type!) && (
            <InputFile
              blob={String(v.defaultValue)}
              file={{
                errors,
                control,
                name: v.name!,
                label: v.label!,
                ref: v.refs?.ref!,
                onClick: v.refs?.onClick,
                onChange: v.refs?.onChange,
                placeholder: v.placeholder!,
                errorMessage: v.errorMessage,
              }}
              icons={[
                {
                  src: <TrashIcon width={16} />,
                  onClick: v.deleteImage,
                },
              ]}
            />
          )}

          {["image"].includes(v.type!) && (
            <div className="flexcol gap-2">
              <h2 className="text-sm font-interMedium -mt-3">{v.label}</h2>
              <Image
                src={String(v.defaultValue)}
                alt={v.type}
                loading="lazy"
                className="aspect-video object-cover"
              />
            </div>
          )}
        </Fragment>
      ))}

      <CategoryModal setValue={setValue} clearErrors={clearErrors} />
    </GridInput>
  );
};

const useHook = () => {
  const { actionIsCategory } = useActiveModal();
  const { ktpRef, onClick, onChange, setKtpBlob } = useKtp();

  const fields: PartialGeneralFields[] = [
    objectFields({
      label: "nama sales",
      name: "salesName",
      type: "text",
      defaultValue: "Andi",
    }),
    objectFields({
      label: "nomor HP",
      name: "phoneNumber",
      type: "text",
      defaultValue: "085824528625",
    }),
    objectFields({
      label: "email",
      name: "email",
      type: "email",
      defaultValue: "adi.nugroho@gmail.com",
    }),
    objectFields({
      label: "kategori",
      name: "category",
      type: "modal",
      defaultValue: "Semua Kategori",
      placeholder: "pilih kategori sales",
      onClick: actionIsCategory,
      readOnly: { isValue: true, cursor: "cursor-pointer" },
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "nama sesuai rekening",
      name: "rekName",
      type: "text",
      defaultValue: "Andi Susanto",
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "nama bank",
      name: "bankName",
      type: "text",
      defaultValue: "Bank Mandiri",
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "nomor rekening",
      name: "noRek",
      type: "text",
      defaultValue: "21414234",
    }),
    objectFields({
      label: "komisi penjualan (%)",
      name: "commission",
      type: "number",
      defaultValue: 10,
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
      defaultValue: ktp,
      deleteImage: () => setKtpBlob(""),
    }),
    objectFields({
      label: "foto sales",
      name: "salesPhoto",
      type: "image",
      defaultValue: ktp,
    }),
  ];

  return { fields };
};

export default Profile;
