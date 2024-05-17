import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { FieldValues, useForm } from "react-hook-form";
import { HiOutlineArrowUpTray, HiOutlineTrash } from "react-icons/hi2";
import { Button } from "src/components/Button";
import { File, LabelAndImage } from "src/components/File";
import { handleErrorMessage, parsePhoneNumber } from "src/helpers";
import { Distributor, useDistributor } from "src/api/distributor.service";
import { IconColor } from "src/types";
import { useKtp } from "src/hooks/document";
import { uploadFile } from "src/firebase/upload";
import { toast } from "react-toastify";
import React from "react";
import Error from "src/components/Error";
import Skeleton from "src/components/Skeleton";
import { Spinner } from "@nextui-org/react";

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
  const { forms, onSubmit, isPending } = useDetailDistributorApi(
    distributorId,
    distributor
  );
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
                      startContent={<HiOutlineArrowUpTray size={16} />}
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
            label={
              isPending ? <Spinner color="secondary" size="sm" /> : "simpan"
            }
            onClick={onSubmit}
            className="mx-auto lg:mt-10 mt-6 sm:mt-8"
          />
        </main>
      )}
    </>
  );
};

export const useDetailDistributorApi = (
  distributorId: string,
  data: Distributor
) => {
  const forms = useForm<FieldValues>();
  const { updateSubDistributor } = useDistributor();

  const onSubmit = forms.handleSubmit(async (e) => {
    try {
      await updateSubDistributor.mutateAsync({
        data: {
          ownerName: e.ownerName ?? data.ownerName,
          name: e.name ?? data.name,
          email: e.email,
          phoneNumber: parsePhoneNumber(e.phoneNumber),
        },
        distributorId,
      });
    } catch (e) {
      const error = e as Error;
      console.error(`Failed to update data : ${error.message}`);
    }
  });

  return {
    forms,
    onSubmit,
    isPending: updateSubDistributor.isPending,
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

  const fields: TextfieldProps<FieldValues>[] = [
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
      description: "*Tidak dapat diedit",
      defaultValue: parsePhoneNumber(data.phoneNumber),
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "email",
      name: "email",
      type: "email",
      autoComplete: "on",
      defaultValue: data.email,
      description: "*Tidak dapat diedit",
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
              src: <HiOutlineTrash color={IconColor.red} size={16} />,
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
