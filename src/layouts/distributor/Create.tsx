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
import { handleErrorMessage } from "src/helpers";
import { useActiveModal } from "src/stores/modalStore";
import { IconColor } from "src/types";
import { CoordinateModal, UserCoordinate } from "src/components/Coordinate";
import useGeneralStore from "src/stores/generalStore";
import { useLocation } from "src/api/location.service";
import { Chip } from "@nextui-org/react";

interface DefaultValues {
  ownerName: string;
  phoneNumber: string;
  email: string;
  businessName: string;
  businessAddress: string;
  streetName: string;
  detailAddress: string;
  ktpImage: string;
  cooridnate: {
    lat: number;
    lng: number;
  };
}

const Create = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DefaultValues>();

  const { ktpBlob, ktpRef, onClick, onChange, setKtpBlob } = useKtp();
  const coordinate = useGeneralStore((v) => v.coordinate);
  const { actionIsCoordinate } = useActiveModal();

  const onSubmit = handleSubmit(async (e) => {
    console.log(e);
  });

  const { findGeoLocation } = useLocation();
  const geoLocation = findGeoLocation(coordinate?.lat!, coordinate?.lng!);
  const zipCode = geoLocation.data?.zipCode ? geoLocation.data?.zipCode : "-";

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
  ];

  return (
    <main className="flexcol gap-5 lg:gap-8">
      {!coordinate ? (
        <Textfield
          name="coodinate"
          defaultValue=""
          label="koordinat usaha"
          placeholder="tentukan koordinat"
          control={control}
          onClick={actionIsCoordinate}
          startContent={<MapPinIcon width={16} color={IconColor.zinc} />}
          errorMessage={handleErrorMessage(errors, "coordinate")}
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
          <div className="flexcol gap-2">
            <Chip color="default">{geoLocation.data?.addressName}</Chip>
            <Chip color="default">
              {geoLocation.data?.district} / {zipCode}
            </Chip>
          </div>
        </section>
      )}

      <>
        <section className="grid lg:grid-cols-4 grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8">
          {fields.map((v, idx) => (
            <React.Fragment key={idx}>
              {["text", "number", "email"].includes(v.type!) && (
                <Textfield
                  {...v}
                  control={control}
                  defaultValue={v.defaultValue}
                  autoComplete={v.autoComplete}
                  errorMessage={handleErrorMessage(errors, v.name)}
                  rules={{
                    required: { value: true, message: v.errorMessage! },
                  }}
                />
              )}

              {["modal"].includes(v.type!) && (
                <Textfield
                  {...v}
                  control={control}
                  defaultValue={v.defaultValue}
                  autoComplete={v.autoComplete}
                  endContent={
                    <ChevronRightIcon width={16} color={IconColor.zinc} />
                  }
                  errorMessage={handleErrorMessage(errors, v.name)}
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
                    control={control}
                    placeholder={v.placeholder}
                    ref={v.uploadImage?.file.ref}
                    onClick={v.uploadImage?.file.onClick}
                    onChange={v.uploadImage?.file.onChange}
                    errorMessage={handleErrorMessage(errors, v.name)}
                    startContent={
                      <ArrowUpTrayIcon width={16} color={IconColor.zinc} />
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
          aria-label="simpan"
          onClick={onSubmit}
          className="mx-auto lg:mt-12 mt-6"
        />
      </>

      <CoordinateModal />
    </main>
  );
};

export const useKtp = () => {
  const [ktpBlob, setKtpBlob] = React.useState("");
  const ktpRef = React.useRef<ChildRef>(null);

  const onClick = () => {
    if (ktpRef.current) ktpRef.current.click();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return null;
    const blob = URL.createObjectURL(files[0]);
    setKtpBlob(blob);
  };

  return { ktpBlob, ktpRef, onClick, onChange, setKtpBlob };
};

export default Create;
