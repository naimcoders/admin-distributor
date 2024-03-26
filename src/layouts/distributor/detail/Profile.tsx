import ktp from "src/assets/images/ktp.png";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { FieldValues, useForm } from "react-hook-form";
import { ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { Button } from "src/components/Button";
import { GridInput } from "src/layouts/Index";
import { File, LabelAndImage } from "src/components/File";
import { handleErrorMessage, parsePhoneNumber } from "src/helpers";
import { useDistributor } from "src/api/distributor.service";
import { useParams } from "react-router-dom";
import Error from "src/components/Error";
import Skeleton from "src/components/Skeleton";
import { IconColor } from "src/types";
import { useKtp } from "../Create";

const Profile = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();
  const [_, setKtpFile] = useState<File>();
  const { fields, isLoading, error } = useHook(setKtpFile);

  const onSubmit = handleSubmit(async (e) => {
    console.log(e);
  });

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : isLoading ? (
        <Skeleton />
      ) : (
        <main className="mt-5 flexcol gap-8">
          <GridInput className="grid grid-cols-3">
            {fields.map((v, idx) => (
              <Fragment key={idx}>
                {["text", "number", "email"].includes(v.type!) && (
                  <Textfield
                    type={v.type}
                    name={v.name}
                    label={v.label}
                    control={control}
                    readOnly={v.readOnly}
                    placeholder={v.placeholder}
                    defaultValue={v.defaultValue}
                    description={v.description}
                    autoComplete={v.autoComplete}
                    errorMessage={handleErrorMessage(errors, v.name)}
                    rules={{
                      required: { value: true, message: v.errorMessage ?? "" },
                    }}
                  />
                )}
              </Fragment>
            ))}
          </GridInput>

          <GridInput className="grid-cols-3">
            {fields.map((v, idx) => (
              <Fragment key={idx}>
                {["file"].includes(v.type!) &&
                  (!v.defaultValue ? (
                    <File
                      name={v.name}
                      label={v.label}
                      control={control}
                      placeholder={v.placeholder}
                      ref={v.uploadImage?.file.ref}
                      onClick={v.uploadImage?.file.onClick}
                      onChange={v.uploadImage?.file.onChange}
                      startContent={<ArrowUpTrayIcon width={16} />}
                      errorMessage={handleErrorMessage(errors, v.name)}
                      rules={{
                        required: {
                          value: true,
                          message: v.errorMessage ?? "",
                        },
                      }}
                    />
                  ) : (
                    <LabelAndImage
                      src={v.defaultValue}
                      label={v.label}
                      actions={v.uploadImage?.image.actions}
                    />
                  ))}
              </Fragment>
            ))}
          </GridInput>

          <div className="flex justify-center mt-10">
            <Button aria-label="simpan" onClick={onSubmit} />
          </div>
        </main>
      )}
    </>
  );
};

const useHook = (setKtpFile: (file: File) => void) => {
  const { ktpRef, onClick, onChange, setKtpBlob } = useKtp(setKtpFile);
  const { id } = useParams() as { id: string };
  const { data, isLoading, error } = useDistributor().findById(id);
  const bank = data?.details?.bank;

  const fields: TextfieldProps[] = [
    objectFields({
      label: "nama pemilik",
      name: "ownerName",
      type: "text",
      autoComplete: "on",
      defaultValue: data?.ownerName,
    }),
    objectFields({
      label: "nomor HP",
      name: "phoneNumber",
      type: "number",
      autoComplete: "on",
      defaultValue: parsePhoneNumber(data?.phoneNumber),
    }),
    objectFields({
      label: "email",
      name: "email",
      type: "email",
      autoComplete: "on",
      defaultValue: data?.email,
    }),
    objectFields({
      label: "nama sesuai rekening",
      name: "accountName",
      type: "text",
      defaultValue: bank?.accountName ?? "-",
      description: "* tidak dapat diedit",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "nama bank",
      name: "bankName",
      type: "text",
      defaultValue: bank?.bankName ?? "-",
      description: "* tidak dapat diedit",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "nomor rekening",
      name: "accountNumber",
      type: "text",
      defaultValue: bank?.accountNumber ?? "-",
      description: "* tidak dapat diedit",
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
        image: {
          actions: [
            {
              src: <TrashIcon color={IconColor.red} width={16} />,
              onClick: () => setKtpBlob(""),
            },
          ],
        },
      },
    }),
  ];

  return { fields, isLoading, error };
};

export default Profile;
