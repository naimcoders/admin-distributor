import {
  ArrowUpTrayIcon,
  ChevronRightIcon,
  MapPinIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { ChildRef, File, LabelAndImage } from "src/components/File";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { handleErrorMessage, parsePhoneNumber } from "src/helpers";
import { useActiveModal } from "src/stores/modalStore";
import { IconColor } from "src/types";
import { CoordinateModal, UserCoordinate } from "src/components/Coordinate";
import useGeneralStore from "src/stores/generalStore";
import { useLocation } from "src/api/location.service";
import { Chip, CircularProgress } from "@nextui-org/react";
import { toast } from "react-toastify";
import { useDistributor } from "src/api/distributor.service";
import { useAuth } from "src/firebase/auth";
import { uploadFile } from "src/firebase/upload";
import { checkPassword } from "src/pages/Index";
import { useNavigate } from "react-router-dom";

interface DefaultValues {
  ownerName: string;
  phoneNumber: string;
  email: string;
  businessName: string;
  detailAddress: string;
  password: string;
  cooridnate: {
    lat: number;
    lng: number;
  };
}

const Create = () => {
  const [ktpFile, setKtpFile] = React.useState<File>();

  const coordinate = useGeneralStore((v) => v.coordinate);
  const { fields, bannerFile } = useField(setKtpFile);
  const { actionIsCoordinate } = useActiveModal();
  const { forms, geoLocation, zipCode, onSubmit, isLoading } = useApi(
    ktpFile,
    bannerFile
  );

  return (
    <main className="flexcol gap-5 lg:gap-8">
      {!coordinate ? (
        <Textfield
          name="coodinate"
          defaultValue=""
          label="koordinat usaha"
          placeholder="tentukan koordinat"
          className="max-w-sm"
          control={forms.control}
          onClick={actionIsCoordinate}
          startContent={<MapPinIcon width={16} color={IconColor.zinc} />}
          errorMessage={handleErrorMessage(
            forms.formState.errors,
            "coordinate"
          )}
          readOnly={{ isValue: true, cursor: "cursor-pointer" }}
          rules={{
            required: { value: true, message: "pilih koordinat" },
          }}
        />
      ) : (
        <section className="flex gap-8">
          <section className="aspect-video lg:w-[20rem] w-[10rem]">
            <UserCoordinate
              label="koordinat usaha"
              lat={coordinate.lat}
              lng={coordinate.lng}
              onClick={actionIsCoordinate}
            />
          </section>
          {!geoLocation.data ? (
            <CircularProgress
              size="md"
              aria-label="loading..."
              className="mx-auto"
            />
          ) : (
            <div className="flexcol gap-2">
              <Chip color="default">{geoLocation.data?.addressName}</Chip>
              <Chip color="default">
                {geoLocation.data?.district} / {zipCode}
              </Chip>
            </div>
          )}
        </section>
      )}

      {coordinate && (
        <>
          <section className="grid lg:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
            {fields.map((v, idx) => (
              <React.Fragment key={idx}>
                {["text", "number", "email", "password"].includes(v.type!) && (
                  <Textfield
                    {...v}
                    control={forms.control}
                    defaultValue=""
                    autoComplete={v.autoComplete}
                    errorMessage={handleErrorMessage(
                      forms.formState.errors,
                      v.name
                    )}
                    rules={{
                      required: { value: true, message: v.errorMessage! },
                    }}
                  />
                )}

                {["modal"].includes(v.type!) && (
                  <Textfield
                    {...v}
                    control={forms.control}
                    defaultValue=""
                    autoComplete={v.autoComplete}
                    endContent={
                      <ChevronRightIcon width={16} color={IconColor.zinc} />
                    }
                    errorMessage={handleErrorMessage(
                      forms.formState.errors,
                      v.name
                    )}
                    readOnly={{ isValue: true, cursor: "cursor-pointer" }}
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
                      control={forms.control}
                      placeholder={v.placeholder}
                      ref={v.uploadImage?.file.ref}
                      onClick={v.uploadImage?.file.onClick}
                      onChange={v.uploadImage?.file.onChange}
                      errorMessage={handleErrorMessage(
                        forms.formState.errors,
                        v.name
                      )}
                      startContent={
                        <ArrowUpTrayIcon
                          width={16}
                          color={IconColor.zinc}
                          className="cursor-pointer"
                        />
                      }
                      rules={{
                        required: { value: true, message: v.errorMessage! },
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
            aria-label={isLoading ? "loading..." : "simpan"}
            onClick={onSubmit}
            className="mx-auto lg:mt-12 mt-6"
          />
        </>
      )}

      <CoordinateModal />
    </main>
  );
};

const useApi = (ktpFile?: File, bannerFile?: File) => {
  const forms = useForm<DefaultValues>();
  const coordinate = useGeneralStore((v) => v.coordinate);
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const { findGeoLocation } = useLocation();
  const geoLocation = findGeoLocation(coordinate?.lat!, coordinate?.lng!);
  const zipCode = geoLocation.data?.zipCode ? geoLocation.data?.zipCode : "-";

  const { create } = useDistributor();
  const { user } = useAuth();

  const onSubmit = forms.handleSubmit(async (e) => {
    if (!geoLocation.data) {
      toast.error("Tentukan koordinat usaha");
      return;
    }
    if (!ktpFile) {
      toast.error("Upload KTP");
      return;
    }
    if (!bannerFile) {
      toast.error("Upload KTP");
      return;
    }

    const ktpImage = `distributor_document/${Date.now()}.png`;

    try {
      await uploadFile({
        file: ktpFile,
        prefix: ktpImage,
      });

      const newPhoneNumber = parsePhoneNumber(e.phoneNumber);

      const obj = {
        email: e.email,
        ownerName: e.ownerName,
        phoneNumber: newPhoneNumber,
        name: e.businessName,
        isSuspend: true,
        isVerify: true,
        password: e.password,
        location: {
          type: "BUSINESS",
          addressName: geoLocation.data.addressName,
          city: geoLocation.data.city,
          detailAddress: e.detailAddress,
          district: geoLocation.data.district,
          lat: geoLocation.data.lat,
          lng: geoLocation.data.lng,
          province: geoLocation.data.province,
          zipCode: geoLocation.data.zipCode,
          userId: user?.uid ?? "",
          isPrimary: true,
        },
        documents: { ktpImage },
      };

      const result = await create.mutateAsync({
        data: obj,
      });

      if (result.id) {
        await uploadFile({
          file: bannerFile,
          prefix: `distributor_banner/${result.id}/${Date.now()}.png`,
        });
        navigate(-1);
      }
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  });

  return { zipCode, geoLocation, forms, onSubmit, isLoading };
};

// TODO: REUSABILITY THIS HOOK

export const useKtp = (setKtpFile: (file: File) => void) => {
  const [ktpBlob, setKtpBlob] = React.useState("");
  const ktpRef = React.useRef<ChildRef>(null);

  const onClick = () => {
    if (ktpRef.current) ktpRef.current.click();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const blob = URL.createObjectURL(files[0]);
    setKtpBlob(blob);
    setKtpFile(files[0]);
  };

  return { ktpBlob, ktpRef, onClick, onChange, setKtpBlob };
};

const useField = (setKtpFile: (file: File) => void) => {
  const [isPassword, setIsPassword] = React.useState(false);
  const { ktpBlob, ktpRef, onClick, onChange, setKtpBlob } = useKtp(setKtpFile);
  const [bannerFile, setBannerFile] = React.useState<File>();
  const [bannerBlob, setBannerBlob] = React.useState("");

  const bannerRef = React.useRef<ChildRef>(null);

  const onClickBanner = () => {
    if (bannerRef.current) bannerRef.current.click();
  };

  const onChangeBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const blob = URL.createObjectURL(files[0]);
    setBannerBlob(blob);
    setBannerFile(files[0]);
  };

  const fields: TextfieldProps[] = [
    objectFields({
      label: "nama pemilik",
      name: "ownerName",
      type: "text",
      autoComplete: "on",
    }),
    objectFields({
      label: "nomor HP",
      name: "phoneNumber",
      type: "number",
      autoComplete: "on",
    }),
    objectFields({
      label: "email",
      name: "email",
      type: "email",
      autoComplete: "on",
    }),
    objectFields({
      label: "nama usaha",
      name: "businessName",
      type: "text",
    }),
    objectFields({
      label: "detail alamat",
      name: "detailAddress",
      type: "text",
    }),
    objectFields({
      label: "password",
      name: "password",
      type: !isPassword ? "password" : "text",
      endContent: checkPassword(isPassword, setIsPassword),
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
        image: {
          actions: [
            {
              src: <TrashIcon width={16} color={IconColor.red} />,
              onClick: () => setKtpBlob(""),
            },
          ],
        },
      },
    }),
    objectFields({
      label: "banner",
      name: "banner",
      type: "file",
      placeholder: "unggah banner",
      defaultValue: bannerBlob,
      uploadImage: {
        file: {
          ref: bannerRef,
          onClick: onClickBanner,
          onChange: onChangeBanner,
        },
        image: {
          actions: [
            {
              src: <TrashIcon width={16} color={IconColor.red} />,
              onClick: () => setBannerBlob(""),
            },
          ],
        },
      },
    }),
  ];

  return { fields, bannerFile };
};

export default Create;
