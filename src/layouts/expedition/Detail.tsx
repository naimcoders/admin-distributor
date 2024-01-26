import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { InputFile } from "src/components/File";
import {
  PartialGeneralFields,
  Textfield,
  objectFields,
} from "src/components/Textfield";
import { parsePhoneNumber } from "src/helpers";
import { useKtp } from "./Create";

const Detail = () => {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { fields } = useHook();

  return (
    <main>
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

  const fields: PartialGeneralFields[] = [
    objectFields({
      label: "nama pemilik",
      name: "ownerName",
      type: "text",
      defaultValue: "Andi",
      autoComplete: "on",
    }),
    objectFields({
      label: "nomor HP",
      name: "phoneNumber",
      type: "text",
      defaultValue: parsePhoneNumber("+62811234567"),
      autoComplete: "on",
    }),
    objectFields({
      label: "email",
      name: "email",
      type: "email",
      defaultValue: "adi.nugroho@gmail.com",
      autoComplete: "on",
    }),
    objectFields({
      label: "nama usaha",
      name: "businessName",
      type: "text",
      defaultValue: "Maju Jaya",
    }),
    objectFields({
      label: "alamat usaha",
      name: "businessAddress",
      type: "modal",
      defaultValue: "SULAWESI SELATAN",
      readOnly: { isValue: true, cursor: "cursor-pointer" },
    }),
    objectFields({
      label: "nama jalan, gedung, no. rumah",
      name: "streetName",
      type: "text",
      defaultValue: "Jl. Pongtiku No. 112",
    }),
    objectFields({
      label: "detail alamat",
      name: "detailAddress",
      type: "text",
      defaultValue: "Depan SMP Negeri 4",
    }),
    objectFields({
      label: "nama sesuai rekening",
      name: "rekName",
      type: "text",
      defaultValue: "Andi Susanto",
      readOnly: { isValue: true, cursor: "cursor-default" },
      description: "*tidak dapat diedit",
    }),
    objectFields({
      label: "nama bank",
      name: "bankName",
      type: "text",
      defaultValue: "Bank Mandiri",
      readOnly: { isValue: true, cursor: "cursor-default" },
      description: "*tidak dapat diedit",
    }),
    objectFields({
      label: "nomor rekening",
      name: "noRek",
      type: "number",
      defaultValue: "15200014357788",
      readOnly: { isValue: true, cursor: "cursor-default" },
      description: "*tidak dapat diedit",
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
      defaultValue: ktpBlob,
      deleteImage: () => setKtpBlob(""),
    }),
  ];

  return { fields };
};

export default Detail;
