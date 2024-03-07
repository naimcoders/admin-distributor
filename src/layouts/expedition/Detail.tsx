import ktp from "src/assets/images/ktp.png";
import useGeneralStore from "src/stores/generalStore";
import {
  ArrowUpTrayIcon,
  ChevronRightIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { File, LabelAndImage } from "src/components/File";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { handleErrorMessage, parsePhoneNumber } from "src/helpers";
import { useKtp } from "./Create";
import { GridInput } from "../Index";
import { useActiveModal } from "src/stores/modalStore";
import {
  CoordinateModal,
  UserCoordinate,
  defaultCoordinate,
} from "src/components/Coordinate";
import { IconColor } from "src/types";

const Detail = () => {
  const {
    control,
    formState: { errors },
  } = useForm<FieldValues>({ mode: "onChange" });

  const { fields } = useHook();
  const coordinate = useGeneralStore((v) => v.coordinate);

  return (
    <main>
      <GridInput className="mt-2">
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
                readOnly={v.readOnly}
              />
            )}

            {["modal"].includes(v.type!) && (
              <Textfield
                name={v.name}
                autoComplete={v.autoComplete}
                control={control}
                defaultValue={v.defaultValue}
                placeholder={v.placeholder}
                readOnly={v.readOnly}
                type="text"
                label={v.label}
                endContent={<ChevronRightIcon width={16} />}
              />
            )}

            {["coordinate"].includes(v.type!) && (
              <UserCoordinate
                label={v.label!}
                onClick={v.onClick}
                lat={coordinate ? coordinate.lat : v.defaultValue.lat}
                lng={coordinate ? coordinate.lng : v.defaultValue.lng}
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
        <Button aria-label="simpan" />
      </div>

      <CoordinateModal />
    </main>
  );
};

const useHook = () => {
  const { ktpRef, onClick, onChange, setKtpBlob } = useKtp();
  const { actionIsCoordinate } = useActiveModal();

  const fields: TextfieldProps[] = [
    objectFields({
      label: "nama pemilik",
      name: "ownerName",
      type: "text",
      defaultValue: "Andi",
      autoComplete: "on",
    }),
    objectFields({
      label: "nomor HP",
      name: "phoneNumber",
      type: "text",
      defaultValue: parsePhoneNumber("+62811234567"),
      autoComplete: "on",
    }),
    objectFields({
      label: "email",
      name: "email",
      type: "email",
      defaultValue: "adi.nugroho@gmail.com",
      autoComplete: "on",
    }),
    objectFields({
      label: "nama usaha",
      name: "businessName",
      type: "text",
      defaultValue: "Maju Jaya",
    }),
    objectFields({
      label: "alamat usaha",
      name: "businessAddress",
      type: "modal",
      defaultValue: "SULAWESI SELATAN",
      readOnly: { isValue: true, cursor: "cursor-pointer" },
    }),
    objectFields({
      label: "nama jalan, gedung, no. rumah",
      name: "streetName",
      type: "text",
      defaultValue: "Jl. Pongtiku No. 112",
    }),
    objectFields({
      label: "detail alamat",
      name: "detailAddress",
      type: "text",
      defaultValue: "Depan SMP Negeri 4",
    }),
    objectFields({
      label: "nama sesuai rekening",
      name: "rekName",
      type: "text",
      defaultValue: "Andi Susanto",
      readOnly: { isValue: true, cursor: "cursor-default" },
      description: "*tidak dapat diedit",
    }),
    objectFields({
      label: "nama bank",
      name: "bankName",
      type: "text",
      defaultValue: "Bank Mandiri",
      readOnly: { isValue: true, cursor: "cursor-default" },
      description: "*tidak dapat diedit",
    }),
    objectFields({
      label: "nomor rekening",
      name: "noRek",
      type: "number",
      defaultValue: "15200014357788",
      readOnly: { isValue: true, cursor: "cursor-default" },
      description: "*tidak dapat diedit",
    }),
    objectFields({
      label: "koordinat usaha",
      name: "coordinate",
      type: "coordinate",
      placeholder: "tentukan koordinat",
      defaultValue: defaultCoordinate,
      onClick: actionIsCoordinate,
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

export default Detail;
