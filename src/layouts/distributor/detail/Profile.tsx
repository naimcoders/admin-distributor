import ktp from "src/assets/images/ktp.png";
import {
  PartialGeneralFields,
  Textfield,
  objectFields,
} from "src/components/Textfield";
import { useKtp } from "../Create";
import { FieldValues, useForm } from "react-hook-form";
import { TrashIcon } from "@heroicons/react/24/outline";
import { InputFile } from "src/components/File";
import { Fragment } from "react";
import { Button } from "src/components/Button";
import { GridInput } from "src/layouts/Index";

const Profile = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({ mode: "onChange" });
  const { fields } = useHook();

  const onSubmit = handleSubmit(async (e) => {
    console.log(e);
  });

  return (
    <main className="mt-5">
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
                // description={v.description}
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
          </Fragment>
        ))}
      </GridInput>

      <div className="flex justify-center mt-10">
        <Button aria-label="simpan" onClick={onSubmit} />
      </div>
    </main>
  );
};

const useHook = () => {
  const { ktpRef, onClick, onChange, setKtpBlob } = useKtp();

  const fields: PartialGeneralFields[] = [
    objectFields({
      label: "nama pemilik",
      name: "ownerName",
      type: "text",
      autoComplete: "on",
      defaultValue: "Andi",
    }),
    objectFields({
      label: "nomor HP",
      name: "phoneNumber",
      type: "number",
      autoComplete: "on",
      defaultValue: "085867554378",
    }),
    objectFields({
      label: "email",
      name: "email",
      type: "email",
      autoComplete: "on",
      defaultValue: "adi.nugroho@gmail.com",
    }),
    objectFields({
      label: "nama sesuai rekening",
      name: "rekName",
      type: "text",
      defaultValue: "Andi Susanto",
      description: "*tidak dapat diedit",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "nama bank",
      name: "bankName",
      type: "text",
      defaultValue: "Bank Mandiri",
      description: "*tidak dapat diedit",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "nomor rekening",
      name: "noRek",
      type: "text",
      defaultValue: "15224275284",
      description: "*tidak dapat diedit",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "KTP pemilik",
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
  ];

  return { fields };
};

export default Profile;
