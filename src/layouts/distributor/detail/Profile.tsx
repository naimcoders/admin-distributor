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

const Profile = () => {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { fields } = useHook();

  return (
    <main className="mt-5">
      <div className="grid-min-300 gap-6">
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
        <Button aria-label="simpan" />
      </div>
    </main>
  );
};

const useHook = () => {
  const { ktpBlob, ktpRef, onClick, onChange, setKtpBlob } = useKtp();
  const newKTP =
    "https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg";

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
      defaultValue: newKTP,
      deleteImage: () => setKtpBlob(""),
    }),
  ];

  return { fields };
};

export default Profile;
