import useGeneralStore from "src/stores/generalStore";
import {
  ArrowUpTrayIcon,
  ChevronRightIcon,
  MapPinIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ChangeEvent, Fragment, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { ChildRef, File, LabelAndImage } from "src/components/File";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { GridInput, WrapperInput } from "../Index";
import { handleErrorMessage } from "src/helpers";
import { UserCoordinate } from "src/components/Coordinate";
import { useActiveModal } from "src/stores/modalStore";
import { IconColor } from "src/types";
import { CoordinateModal } from "src/components/Modal";

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

  const coordinate = useGeneralStore((v) => v.coordinate);
  const { actionIsCoordinate } = useActiveModal();

  return (
    <WrapperInput>
      <GridInput>
        {fields.map((v, idx) => (
          <Fragment key={idx}>
            {["text", "number", "email"].includes(v.type!) && (
              <Textfield
                {...v}
                label={v.label}
                control={control}
                // defaultValue={v.defaultValue}
                errorMessage={handleErrorMessage(errors, v.name)}
                rules={{
                  required: { value: true, message: v.errorMessage! },
                }}
              />
            )}

            {["modal"].includes(v.type!) && (
              <Textfield
                name={v.name!}
                label={v.label}
                control={control}
                readOnly={v.readOnly}
                autoComplete={v.autoComplete}
                defaultValue={v.defaultValue}
                placeholder={v.placeholder}
                endContent={<ChevronRightIcon width={16} />}
                errorMessage={handleErrorMessage(errors, v.name)}
                rules={{
                  required: { value: true, message: v.errorMessage! },
                }}
              />
            )}
          </Fragment>
        ))}
      </GridInput>

      <GridInput className="grid-cols-3 ">
        {fields.map((v, idx) => (
          <Fragment key={idx}>
            {["coordinate"].includes(v.type!) &&
              (coordinate ? (
                <UserCoordinate
                  label={v.label!}
                  lat={coordinate.lat}
                  lng={coordinate.lng}
                  onClick={actionIsCoordinate}
                />
              ) : (
                <Textfield
                  name={v.name!}
                  label={v.label}
                  control={control}
                  onClick={v.onClick}
                  defaultValue={v.defaultValue}
                  placeholder={v.placeholder}
                  autoComplete={v.autoComplete}
                  startContent={
                    <MapPinIcon width={16} color={IconColor.zinc} />
                  }
                  errorMessage={handleErrorMessage(errors, v.name)}
                  readOnly={{ isValue: true, cursor: "cursor-pointer" }}
                  rules={{
                    required: { value: true, message: v.errorMessage! },
                  }}
                />
              ))}

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
                    required: { value: true, message: v.errorMessage ?? "" },
                  }}
                />
              ) : (
                <LabelAndImage src={v.defaultValue} label={v.label} />
              ))}
          </Fragment>
        ))}
      </GridInput>

      <div className="flex justify-center mt-10">
        <Button aria-label="simpan" onClick={onSubmit} />
      </div>

      <CoordinateModal />
    </WrapperInput>
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
  const { actionIsCoordinate } = useActiveModal();
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
      type: "number",
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
      label: "koordinat usaha",
      name: "coordinate",
      type: "coordinate",
      defaultValue: "",
      placeholder: "tentukan koordinat",
      onClick: actionIsCoordinate,
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

  return { fields };
};

export default Create;
