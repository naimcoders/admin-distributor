import {
  ArrowUpTrayIcon,
  ChevronRightIcon,
  MapPinIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { File, LabelAndImage } from "src/components/File";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { handleErrorMessage, parsePhoneNumber } from "src/helpers";
import { useActiveModal } from "src/stores/modalStore";
import { IconColor } from "src/types";
import Coordinate, {
  CoordinateProps,
  UserCoordinate,
} from "src/components/Coordinate";
import { findGeoLocation } from "src/api/location.service";
import { Chip, CircularProgress, Spinner } from "@nextui-org/react";
import { toast } from "react-toastify";
import { createDistributor } from "src/api/distributor.service";
import { useAuth } from "src/firebase/auth";
import { uploadFile } from "src/firebase/upload";
import { checkPassword } from "src/pages/Index";
import { useNavigate } from "react-router-dom";
import { useBanner, useKtp } from "src/hooks/document";
import { Modal } from "src/components/Modal";

interface DefaultValues {
  ownerName: string;
  phoneNumber: string;
  email: string;
  businessName: string;
  detailAddress: string;
  password: string;
  ktp: string;
  banner: string;
  coordinate: {
    lat: number;
    lng: number;
  };
}

const Create = () => {
  const [latLng, setLatLng] = React.useState<CoordinateProps>({
    lat: 0,
    lng: 0,
  });

  const { fields, bannerFile, ktpFile } = useField();
  const { actionIsCoordinate, isCoordinate } = useActiveModal();
  const { forms, geoLocation, zipCode, onSubmit, isPending } = useApi(
    latLng.lat,
    latLng.lng,
    ktpFile,
    bannerFile
  );

  return (
    <main className="flex flex-col gap-5 lg:gap-8">
      {!latLng.lng ? (
        <Textfield
          name="coordinate"
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
              lat={latLng.lat}
              lng={latLng.lng}
              onClick={actionIsCoordinate}
              zoom={18}
            />
          </section>
          {!geoLocation.data ? (
            <CircularProgress
              size="md"
              aria-label="loading..."
              className="mx-auto"
            />
          ) : (
            <div className="flex flex-col gap-2">
              <Chip color="default">{geoLocation.data?.addressName}</Chip>
              <Chip color="default">
                {geoLocation.data?.district} / {zipCode}
              </Chip>
            </div>
          )}
        </section>
      )}

      {Boolean(latLng.lat) && (
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
                      src={String(v.defaultValue)}
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
            className="mx-auto lg:mt-12 my-4"
          />
        </>
      )}

      <Modal isOpen={isCoordinate} closeModal={actionIsCoordinate}>
        <Coordinate
          setCoordinate={({ lat, lng }) => setLatLng({ lat, lng })}
          zoom={!latLng.lat ? 11 : 18}
          lat={latLng.lat}
          lng={latLng.lng}
        />
      </Modal>
    </main>
  );
};

const useApi = (
  lat: number,
  lng: number,
  ktpFile?: File,
  bannerFile?: File
) => {
  const forms = useForm<DefaultValues>();
  const navigate = useNavigate();

  const geoLocation = findGeoLocation(lat, lng);
  const zipCode = geoLocation.data?.zipCode ? geoLocation.data?.zipCode : "-";

  const { mutateAsync, isPending } = createDistributor();
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
      toast.loading("Loading...", { toastId: "loading-create-distributor" });
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

      const result = await mutateAsync({
        data: obj,
      });

      if (result.id) {
        await uploadFile({
          file: bannerFile,
          prefix: `distributor_banner/${result.id}/${Date.now()}.png`,
        });
        navigate(-1);
        toast.success("Sub-Distributor berhasil dibuat");
      }
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to create sub-distributor: ${error.message}`);
    } finally {
      toast.dismiss("loading-create-distributor");
    }
  });

  return { zipCode, geoLocation, forms, onSubmit, isPending };
};

const useField = () => {
  const [isPassword, setIsPassword] = React.useState(false);
  const { ktpBlob, ktpRef, onClickKtp, onChangeKtp, setKtpBlob, ktpFile } =
    useKtp();
  const {
    bannerBlob,
    bannerRef,
    onChangeBanner,
    bannerFile,
    onClickBanner,
    setBannerBlob,
  } = useBanner();

  const fields: TextfieldProps<DefaultValues>[] = [
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
          onClick: onClickKtp,
          onChange: onChangeKtp,
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

  return { fields, bannerFile, ktpFile };
};

export default Create;
