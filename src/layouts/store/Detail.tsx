import ktp from "src/assets/images/ktp.png";
import banner from "src/assets/images/banner_etalase.jpg";
import { Fragment } from "react";
import { FieldValues, useForm } from "react-hook-form";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { GridInput } from "../Index";
import { LabelAndImage } from "src/components/File";
import {
  CoordinateProps,
  UserCoordinate,
  defaultCoordinate,
} from "src/components/Coordinate";

const Detail = () => {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { fields } = useDetail();

  return (
    <GridInput>
      {fields.map((v, idx) => (
        <Fragment key={idx}>
          {["text", "number", "email"].includes(v.type!) && (
            <Textfield
              name={v.name}
              type={v.type}
              label={v.label}
              control={control}
              defaultValue={v.defaultValue}
              autoComplete={v.autoComplete}
              readOnly={v.readOnly}
            />
          )}

          {["coordinate"].includes(v.type!) && (
            <UserCoordinate
              label={v.label}
              cursor="default"
              lat={v.defaultValue.lat}
              lng={v.defaultValue.lng}
            />
          )}

          {["image"].includes(v.type!) && (
            <LabelAndImage label={v.label!} src={v.defaultValue} />
          )}
        </Fragment>
      ))}
    </GridInput>
  );
};

const useDetail = () => {
  const fields: TextfieldProps[] = [
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "nama pemilik",
      name: "ownerName",
      type: "text",
      defaultValue: "naim",
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "nomor HP",
      name: "phoneNumber",
      type: "text",
      defaultValue: "085824528625",
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "email",
      name: "email",
      type: "email",
      defaultValue: "adi.nugroho@gmail.com",
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "tanggal join",
      name: "joinDate",
      type: "text",
      defaultValue: "13 Des 2023",
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "nama toko",
      name: "storeName",
      type: "text",
      defaultValue: "Maju Jaya",
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "alamat toko",
      name: "storeAddress",
      type: "text",
      defaultValue: "SULAWESI SELATAN, KOTA MAKASSAR",
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "nama jalan, gedung, no. rumah",
      name: "streetName",
      type: "text",
      defaultValue: "Jl. Pongtiku No. 112",
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "detail alamat",
      name: "detailAddress",
      type: "text",
      defaultValue: "Depan SMP Negeri 4",
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "total revenue",
      name: "totalRevenue",
      type: "text",
      defaultValue: `Rp85.000.000`,
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "total transaksi",
      name: "totalTransaction",
      type: "number",
      defaultValue: 321,
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "rating",
      name: "rate",
      type: "text",
      defaultValue: "0",
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "status akun",
      name: "verify",
      type: "text",
      defaultValue: "Verified",
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "PIC sales",
      name: "picSales",
      type: "text",
      defaultValue: "-",
    }),
    objectFields({
      label: "koordinat toko",
      name: "coordinate",
      type: "coordinate",
      defaultValue: defaultCoordinate as CoordinateProps,
    }),
    objectFields({
      label: "KTP pemilik",
      name: "ktp",
      type: "image",
      defaultValue: ktp,
    }),
    objectFields({
      label: "banner etalase",
      name: "banner",
      type: "image",
      defaultValue: banner,
    }),
  ];

  return { fields };
};

export default Detail;
