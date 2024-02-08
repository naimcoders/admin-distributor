import ktp from "src/assets/images/ktp.png";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { useKtp } from "../Create";
import { FieldValues, useForm } from "react-hook-form";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Button } from "src/components/Button";
import { GridInput, GridWithoutTextfield } from "src/layouts/Index";
import { File, LabelAndImage } from "src/components/File";
import { handleErrorMessage } from "src/helpers";

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
    <main className="mt-5 flexcol gap-8">
      <GridInput>
        {fields.map((v, idx) => (
          <Fragment key={idx}>
            {["text", "number", "email"].includes(v.type!) && (
              <Textfield
                type={v.type}
                label={v.label}
                control={control}
                name={v.name ?? ""}
                readOnly={v.readOnly}
                placeholder={v.placeholder}
                defaultValue={v.defaultValue}
                autoComplete={v.autoComplete}
              />
            )}
          </Fragment>
        ))}
      </GridInput>

      <GridWithoutTextfield>
        {fields.map((v, idx) => (
          <Fragment key={idx}>
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
      </GridWithoutTextfield>

      <div className="flex justify-center mt-10">
        <Button aria-label="simpan" onClick={onSubmit} />
      </div>
    </main>
  );
};

const useHook = () => {
  const { ktpRef, onClick, onChange, setKtpBlob } = useKtp();

  const fields: TextfieldProps[] = [
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
      defaultValue: ktp,
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

export default Profile;
