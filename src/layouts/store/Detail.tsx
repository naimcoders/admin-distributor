import Error from "src/components/Error";
import Skeleton from "src/components/Skeleton";
import { Fragment } from "react";
import { FieldValues, useForm } from "react-hook-form";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { GridInput } from "../Index";
import { LabelAndImage } from "src/components/File";
import { UserCoordinate } from "src/components/Coordinate";
import { useStore } from "src/api/store.service";
import { useParams } from "react-router-dom";
import { epochToDateConvert, parsePhoneNumber } from "src/helpers";

const Detail = () => {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { fields, isLoading, error, location } = useHook();

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : isLoading ? (
        <Skeleton />
      ) : (
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

              {["coordinate"].includes(v.type!) && location?.lat && (
                <UserCoordinate
                  label={v.label}
                  cursor="default"
                  lat={location.lat}
                  lng={location.lng}
                />
              )}

              {["image"].includes(v.type!) && (
                <LabelAndImage label={v.label} src={v.defaultValue} />
              )}
            </Fragment>
          ))}
        </GridInput>
      )}
    </>
  );
};

const useHook = () => {
  const { id } = useParams() as { id: string };
  const { data, isLoading, error } = useStore().findByid(id);
  const location = data?.location[0];
  const storeAddress = `${location?.province}, ${location?.city}, ${location?.district}, ${location?.zipCode}`;

  const fields: TextfieldProps[] = [
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "nama pemilik",
      name: "ownerName",
      type: "text",
      defaultValue: data?.ownerName,
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "nomor HP",
      name: "phoneNumber",
      type: "text",
      defaultValue: parsePhoneNumber(data?.phoneNumber),
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "email",
      name: "email",
      type: "email",
      defaultValue: data?.email,
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "tanggal join",
      name: "joinDate",
      type: "text",
      defaultValue: epochToDateConvert(data?.createdAt),
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "nama toko",
      name: "storeName",
      type: "text",
      defaultValue: data?.storeName,
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "alamat toko",
      name: "storeAddress",
      type: "text",
      defaultValue: storeAddress,
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
      defaultValue: location?.detailAddress,
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
      defaultValue: data?.rate,
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
      defaultValue: "",
    }),
    objectFields({
      label: "KTP pemilik",
      name: "ktp",
      type: "image",
      defaultValue: data?.ktpImageUrl,
    }),
    objectFields({
      label: "banner etalase",
      name: "banner",
      type: "image",
      defaultValue: data?.banner,
    }),
  ];

  return { fields, isLoading, error, location };
};

export default Detail;
