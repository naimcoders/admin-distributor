import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { useForm } from "react-hook-form";
import { ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "src/components/Button";
import { File, LabelAndImage } from "src/components/File";
import { handleErrorMessage, parsePhoneNumber } from "src/helpers";
import { Distributor, useDistributor } from "src/api/distributor.service";
import { IconColor } from "src/types";
import { useKtp } from "src/hooks/document";
import { uploadFile } from "src/firebase/upload";
import { toast } from "react-toastify";
import { ChangePasswordValues } from "src/components/ChangePassword";
import React from "react";
import Error from "src/components/Error";
import Skeleton from "src/components/Skeleton";

export interface KtpFile {
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
  const { forms, onSubmit, isPending } = useApi(distributor);
  const { fields } = useField(distributor, distributorId, ktp);

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
            aria-label={isPending ? "loading..." : "simpan"}
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
  password: string;
}

const useApi = (data: Distributor) => {
  const forms = useForm<DefaultValues>();
  const formsChangePwd = useForm<ChangePasswordValues>();

  const { update } = useDistributor();

  const onSubmit = forms.handleSubmit(async (e) => {
    try {
      // await update.mutateAsync({
      //   data: {
      //     email: e.email,
      //     ownerName: e.ownerName,
      //     phoneNumber: parsePhoneNumber(e.phoneNumber),
      //     name: data.name,
      //   },
      // });
      // formsChangePwd.reset();
    } catch (e) {
      const error = e as Error;
      console.error(`Failed to update data : ${error.message}`);
    }
  });

  return {
    forms,
    onSubmit,
    formsChangePwd,
    isPending: update.isPending,
  };
};

const useField = (data: Distributor, distributorId: string, ktp: KtpFile) => {
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
          oldKtpImage: data.documents.ktpImage,
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
      defaultValue: data.ownerName,
    }),
    objectFields({
      label: "nomor HP",
      name: "phoneNumber",
      type: "number",
      autoComplete: "on",
      defaultValue: parsePhoneNumber(data.phoneNumber),
    }),
    objectFields({
      label: "email",
      name: "email",
      type: "email",
      autoComplete: "on",
      defaultValue: data.email,
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

  return { fields };
};

export default Profile;
