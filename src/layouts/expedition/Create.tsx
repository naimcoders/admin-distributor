import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, Fragment, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { ChildRef, InputFile } from "src/components/File";
import {
  PartialGeneralFields,
  Textfield,
  objectFields,
} from "src/components/Textfield";

const Create = () => {
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

const useKtp = () => {
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

  const fields: PartialGeneralFields[] = [
    objectFields({
      label: "nama pemilik",
      name: "ownerName",
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
      label: "nama usaha",
      name: "businessName",
      type: "text",
      defaultValue: "",
    }),
    objectFields({
      label: "alamat usaha",
      name: "businessAddress",
      type: "modal",
      defaultValue: "",
      readOnly: { isValue: true, cursor: "cursor-pointer" },
    }),
    objectFields({
      label: "nama jalan, gedung, no. rumah",
      name: "streetName",
      type: "text",
      defaultValue: "",
    }),
    objectFields({
      label: "detail alamat",
      name: "detailAddress",
      type: "text",
      defaultValue: "",
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

export default Create;
