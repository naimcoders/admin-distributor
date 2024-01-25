import { Fragment } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Image from "src/components/Image";
import {
  PartialGeneralFields,
  Textfield,
  objectFields,
} from "src/components/Textfield";

const Detail = () => {
  const { control } = useForm<FieldValues>({ mode: "onChange" });
  const { fields } = useDetail();

  return (
    <main className="grid-min-300 gap-6">
      {fields.map((v, idx) => (
        <Fragment key={idx}>
          {["text", "number", "email"].includes(v.type!) && (
            <Textfield
              type={v.type}
              label={v.label}
              control={control}
              name={v.name ?? ""}
              defaultValue={v.defaultValue}
              autoComplete={v.autoComplete}
              readOnly={{
                isValue: v.readOnly?.isValue!,
                cursor: v.readOnly?.isValue ? "cursor-default" : "cursor-text",
              }}
            />
          )}

          {["image"].includes(v.type!) && (
            <div className="flexcol gap-2 text-sm capitalize font-interMedium">
              <h2>{v.label}</h2>
              <Image
                src={String(v.defaultValue)}
                alt={v.label}
                loading="lazy"
              />
            </div>
          )}
        </Fragment>
      ))}
    </main>
  );
};

const useDetail = () => {
  // TODO: FETCH DATA

  const fields: PartialGeneralFields[] = [
    objectFields({
      readOnly: { isValue: true },
      label: "nama pemilik",
      name: "ownerName",
      type: "text",
      defaultValue: "naim",
    }),
    objectFields({
      readOnly: { isValue: true },
      label: "nomor HP",
      name: "phoneNumber",
      type: "text",
      defaultValue: "085824528625",
    }),
    objectFields({
      readOnly: { isValue: true },
      label: "email",
      name: "email",
      type: "email",
      defaultValue: "adi.nugroho@gmail.com",
    }),
    objectFields({
      readOnly: { isValue: true },
      label: "tanggal join",
      name: "joinDate",
      type: "text",
      defaultValue: "13 Des 2023",
    }),
    objectFields({
      readOnly: { isValue: true },
      label: "nama toko",
      name: "storeName",
      type: "text",
      defaultValue: "Maju Jaya",
    }),
    objectFields({
      readOnly: { isValue: true },
      label: "alamat toko",
      name: "storeAddress",
      type: "text",
      defaultValue: "SULAWESI SELATAN, KOTA MAKASSAR",
    }),
    objectFields({
      readOnly: { isValue: true },
      label: "nama jalan, gedung, no. rumah",
      name: "streetName",
      type: "text",
      defaultValue: "Jl. Pongtiku No. 112",
    }),
    objectFields({
      readOnly: { isValue: true },
      label: "detail alamat",
      name: "detailAddress",
      type: "text",
      defaultValue: "Depan SMP Negeri 4",
    }),
    objectFields({
      readOnly: { isValue: true },
      label: "total revenue",
      name: "totalRevenue",
      type: "text",
      defaultValue: `Rp85.000.000`,
    }),
    objectFields({
      readOnly: { isValue: true },
      label: "total transaksi",
      name: "totalTransaction",
      type: "number",
      defaultValue: 321,
    }),
    objectFields({
      readOnly: { isValue: true },
      label: "rating",
      name: "rate",
      type: "text",
      defaultValue: "0",
    }),
    objectFields({
      readOnly: { isValue: true },
      label: "status akun",
      name: "verify",
      type: "text",
      defaultValue: "Verified",
    }),
    objectFields({
      readOnly: { isValue: true },
      label: "PIC sales",
      name: "picSales",
      type: "text",
      defaultValue: "-",
    }),
    objectFields({
      label: "KTP pemilik",
      name: "ktp",
      type: "image",
      defaultValue:
        "https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg",
    }),
    objectFields({
      label: "banner etalase",
      name: "banner",
      type: "image",
      defaultValue:
        "https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg",
    }),
  ];

  return { fields };
};

export default Detail;
