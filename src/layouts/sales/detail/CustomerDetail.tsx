import {
  PartialGeneralFields,
  Textfield,
  objectFields,
} from "src/components/Textfield";
import { useActiveModal } from "src/stores/modalStore";
import { CategoryModal, useKtp } from "../Create";
import { Fragment } from "react";
import { handleErrorMessage } from "src/helpers";
import { FieldValues, useForm } from "react-hook-form";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

const CustomerDetail = () => {
  const {
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: "onChange",
  });

  const { fields } = useHook();

  return (
    <main>
      <div className="grid-min-300 gap-6">
        {fields.map((v, idx) => (
          <Fragment key={idx}>
            {["text", "number", "email"].includes(v.type!) && (
              <Textfield
                type={v.type}
                label={v.label}
                control={control}
                name={v.name ?? ""}
                placeholder={v.placeholder}
                defaultValue={v.defaultValue}
                autoComplete={v.autoComplete}
                errorMessage={handleErrorMessage(errors, v.name)}
                rules={{
                  required: { value: true, message: v.errorMessage ?? "" },
                }}
                readOnly={v.readOnly}
              />
            )}

            {["modal"].includes(v.type!) && (
              <Textfield
                name={v.name!}
                label={v.label}
                control={control}
                onClick={v.onClick}
                readOnly={v.readOnly}
                placeholder={v.placeholder}
                defaultValue={v.defaultValue}
                autoComplete={v.autoComplete}
                endContent={<ChevronRightIcon width={16} />}
                errorMessage={handleErrorMessage(errors, v.name)}
                rules={{
                  required: { value: true, message: v.errorMessage ?? "" },
                }}
              />
            )}

            {/* {["file"].includes(v.type!) && (
              <InputFile
                label={v.label!}
                blob={String(v.defaultValue)}
                file={{
                  ref: v.refs?.ref!,
                  onChange: v.refs?.onChange,
                  onClick: v.refs?.onClick,
                  btnLabel: v.placeholder!,
                }}
                icons={[
                  {
                    src: <TrashIcon width={16} />,
                    onClick: v.deleteImage,
                  },
                ]}
              />
            )} */}
          </Fragment>
        ))}
      </div>

      {/* <CategoryModal setValue={setValue} clearErrors={clearErrors} /> */}
    </main>
  );
};

const useHook = () => {
  // const { ktpBlob, ktpRef, onClick, onChange, setKtpBlob } = useKtp();
  // const { actionIsCategory } = useActiveModal();

  const fields: PartialGeneralFields[] = [
    objectFields({
      label: "nama pemilik",
      name: "ownerName",
      type: "text",
      defaultValue: "Andi",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "nomor HP",
      name: "phoneNumber",
      type: "text",
      defaultValue: "085845678634",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "email",
      name: "email",
      type: "email",
      defaultValue: "-",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "tanggal join",
      name: "category",
      type: "text",
      defaultValue: "13 Des 2023",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "nama toko",
      name: "storeName",
      type: "text",
      defaultValue: "Mba Atun",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "alamat toko",
      name: "storeAddress",
      type: "text",
      defaultValue: "SULAWESI SELATAN, KOTA MAKASSAR",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "nama jalan, gedung, no. rumah",
      name: "street",
      type: "text",
      defaultValue: "Jl. Pongtiku No. 112",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "detail alamat",
      name: "detailAddress",
      type: "text",
      defaultValue: "Depan SMP Negeri 4",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "total revenue",
      name: "totalRevenue",
      type: "number",
      defaultValue: 112980000,
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "total transaksi",
      name: "totalTransaction",
      type: "number",
      defaultValue: 647,
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "rating",
      name: "rate",
      type: "text",
      defaultValue: "-",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "status akun",
      name: "statusAccount",
      type: "text",
      defaultValue: "-",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    // objectFields({
    //   label: "detail alamat",
    //   name: "detailAddress",
    //   type: "text",
    //   defaultValue: "Depan SMP Negeri 4",
    //   readOnly: { isValue: true, cursor: "cursor-default" },
    // }),
    // objectFields({
    //   label: "KTP sales",
    //   name: "ktp",
    //   type: "file",
    //   placeholder: "unggah KTP",
    //   refs: {
    //     ref: ktpRef,
    //     onClick,
    //     onChange,
    //   },
    //   defaultValue: ktpBlob,
    //   deleteImage: () => setKtpBlob(""),
    // }),
  ];

  return { fields };
};

export default CustomerDetail;
