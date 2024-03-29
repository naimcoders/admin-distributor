import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { useForm } from "react-hook-form";
import {
  ArrowUpTrayIcon,
  ChevronRightIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { Button } from "src/components/Button";
import { File, LabelAndImage } from "src/components/File";
import { handleErrorMessage, parsePhoneNumber } from "src/helpers";
import { Distributor, useDistributor } from "src/api/distributor.service";
import { IconColor } from "src/types";
import Error from "src/components/Error";
import Skeleton from "src/components/Skeleton";
import { useKtp } from "src/hooks/document";
import { uploadFile } from "src/firebase/upload";
import { toast } from "react-toastify";
import { checkPassword } from "src/pages/Index";

interface KtpFile {
  file: string;
  setFile: (v: string) => void;
}

interface Profile {
  ktp: KtpFile;
  distributor: Distributor;
  distributorId: string;
  isLoading?: boolean;
  error?: string;
}

const Profile = ({
  distributor,
  error,
  isLoading,
  ktp,
  distributorId,
}: Profile) => {
  const [isPassword, setIsPassword] = React.useState(false);
  const { forms, onSubmit } = useApi(distributorId);
  const { updateDocument } = useDistributor();

  const {
    ktpRef,
    onClickKtp,
    onChangeKtp,
    setKtpBlob,
    ktpBlob,
    ktpFile,
    setKtpFile,
  } = useKtp();

  React.useEffect(() => {
    if (ktpFile) onUpdateKtp();
  }, [ktpFile]);

  const onUpdateKtp = async () => {
    try {
      if (!ktpFile) return;
      const ktpPath = `distributor_document/${Date.now()}.png`;
      toast.loading("Sedang upload foto KTP", {
        toastId: "upload-foto-ktp",
      });

      await uploadFile({
        file: ktpFile,
        prefix: ktpPath,
      });

      await updateDocument.mutateAsync({
        data: {
          distributorId,
          ktpImage: ktpPath,
          oldKtpImage: distributor.documents.ktpImage,
        },
      });
    } catch (e) {
      const error = e as Error;
      console.error(`Failed to update ktp : ${error.message}`);
    } finally {
      toast.dismiss("upload-foto-ktp");
      setKtpFile(undefined);
    }
  };

  const fields: TextfieldProps[] = [
    objectFields({
      label: "nama pemilik",
      name: "ownerName",
      type: "text",
      autoComplete: "on",
      defaultValue: distributor.ownerName,
    }),
    objectFields({
      label: "nomor HP",
      name: "phoneNumber",
      type: "number",
      autoComplete: "on",
      defaultValue: parsePhoneNumber(distributor.phoneNumber),
    }),
    objectFields({
      label: "email",
      name: "email",
      type: "email",
      autoComplete: "on",
      defaultValue: distributor.email,
    }),
    objectFields({
      label: "password",
      name: "password",
      type: "modal",
      defaultValue: "",
      readOnly: { isValue: true, cursor: "cursor-default" },
      endContent: <ChevronRightIcon width={18} color={IconColor.zinc} />,
    }),
    objectFields({
      label: "nama sesuai rekening",
      name: "accountName",
      type: "text",
      defaultValue: "-",
      description: "* tidak dapat diedit",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "nama bank",
      name: "bankName",
      type: "text",
      defaultValue: "-",
      description: "* tidak dapat diedit",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "nomor rekening",
      name: "accountNumber",
      type: "text",
      defaultValue: "-",
      description: "* tidak dapat diedit",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "KTP pemilik",
      name: "ktp",
      type: "file",
      placeholder: "unggah KTP",
      defaultValue: !ktpBlob ? ktp.file : ktpBlob,
      uploadImage: {
        file: {
          ref: ktpRef,
          onClick: onClickKtp,
          onChange: onChangeKtp,
        },
        image: {
          actions: [
            {
              src: <TrashIcon color={IconColor.red} width={16} />,
              onClick: () => (!ktpBlob ? ktp.setFile("") : setKtpBlob("")),
            },
          ],
        },
      },
    }),
  ];

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : isLoading ? (
        <Skeleton />
      ) : (
        <main className="mt-5 flex flex-col lg:gap-8 gap-4">
          <section className="grid grid-cols-3 lg:gap-8 gap-4">
            {fields.map((v, idx) => (
              <React.Fragment key={idx}>
                {["text", "number", "email", "modal"].includes(v.type!) && (
                  <Textfield
                    {...v}
                    control={forms.control}
                    errorMessage={handleErrorMessage(
                      forms.formState.errors,
                      v.name
                    )}
                    rules={{
                      required: { value: true, message: v.errorMessage ?? "" },
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </section>

          <section className="grid-cols-3 grid gap-4 lg:gap-8">
            {fields.map((v, idx) => (
              <React.Fragment key={idx}>
                {["file"].includes(v.type!) &&
                  (!v.defaultValue ? (
                    <File
                      name={v.name}
                      label={v.label}
                      control={forms.control}
                      placeholder={v.placeholder}
                      ref={v.uploadImage?.file.ref}
                      onClick={v.uploadImage?.file.onClick}
                      onChange={v.uploadImage?.file.onChange}
                      startContent={<ArrowUpTrayIcon width={16} />}
                      errorMessage={handleErrorMessage(
                        forms.formState.errors,
                        v.name
                      )}
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
              </React.Fragment>
            ))}
          </section>

          <Button
            aria-label="simpan"
            onClick={onSubmit}
            className="mx-auto lg:mt-10 mt-6 sm:mt-8"
          />
        </main>
      )}
    </>
  );
};

interface DefaultValues {
  ownerName: string;
  phoneNumber: string;
  email: string;
}

const useApi = (distributorId: string) => {
  const forms = useForm<DefaultValues>();

  const { update } = useDistributor();
  const onSubmit = forms.handleSubmit(async (e) => {
    try {
      await update.mutateAsync({
        data: {
          email: e.email,
          ownerName: e.ownerName,
          phoneNumber: parsePhoneNumber(e.phoneNumber),
          name: "ndakdal",
          // oldPassword: "12345",
          // password: "54321",
        },
      });
    } catch (e) {
      const error = e as Error;
      console.error(`Failed to update data : ${error.message}`);
    }
  });

  return { forms, onSubmit };
};

export default Profile;
