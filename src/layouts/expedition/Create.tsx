import { ArrowUpTrayIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, Fragment, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { ChildRef, File, LabelAndImage } from "src/components/File";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { GridInput } from "../Index";
import { handleErrorMessage } from "src/helpers";

const Create = () => {
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
    <main>
      <GridInput className="mt-4">
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
                errorMessage={handleErrorMessage(errors, v.name)}
                rules={{
                  required: { value: true, message: v.errorMessage! },
                }}
                className="w-full"
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
                className="w-full"
                endContent={<ChevronRightIcon width={16} />}
                errorMessage={handleErrorMessage(errors, v.name)}
                rules={{
                  required: { value: true, message: v.errorMessage! },
                }}
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
                  startContent={<ArrowUpTrayIcon width={16} />}
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
        <Button aria-label="simpan" onClick={onSubmit} />
      </div>
    </main>
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

  const fields: TextfieldProps[] = [
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
      defaultValue: ktpBlob,
      uploadImage: {
        file: {
          ref: ktpRef,
          onClick,
          onChange,
        },
        image: { deleteImage: () => setKtpBlob("") },
      },
    }),
  ];

  return { fields };
};

export default Create;
