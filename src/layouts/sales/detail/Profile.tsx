import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { FieldValues, useForm } from "react-hook-form";
import {
  PartialGeneralFields,
  Textfield,
  objectFields,
} from "src/components/Textfield";
import { useActiveModal } from "src/stores/modalStore";
import { CategoryModal } from "../Create";

const Profile = () => {
  const { control, setValue, clearErrors } = useForm<FieldValues>({
    mode: "onChange",
  });
  const { fields } = useHook();

  return (
    <section className="grid-min-300 gap-6 mt-5">
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
              description={v.description}
            />
          )}

          {["modal"].includes(v.type!) && (
            <Textfield
              name={v.name!}
              autoComplete={v.autoComplete}
              control={control}
              defaultValue={v.defaultValue}
              placeholder={v.placeholder}
              readOnly={v.readOnly}
              type="text"
              label={v.label}
              endContent={<ChevronRightIcon width={16} />}
              onClick={v.onClick}
            />
          )}
        </Fragment>
      ))}

      {/* <CategoryModal setValue={setValue} clearErrors={clearErrors} /> */}
    </section>
  );
};

const useHook = () => {
  const { actionIsCategory } = useActiveModal();

  const fields: PartialGeneralFields[] = [
    objectFields({
      label: "nama sales",
      name: "salesName",
      type: "text",
      defaultValue: "Andi",
    }),
    objectFields({
      label: "nomor HP",
      name: "phoneNumber",
      type: "text",
      defaultValue: "085824528625",
    }),
    objectFields({
      label: "email",
      name: "email",
      type: "email",
      defaultValue: "adi.nugroho@gmail.com",
    }),
    objectFields({
      label: "kategori",
      name: "category",
      type: "modal",
      defaultValue: "Semua Kategori",
      placeholder: "pilih kategori sales",
      onClick: actionIsCategory,
      readOnly: { isValue: true, cursor: "cursor-pointer" },
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "nama sesuai rekening",
      name: "rekName",
      type: "text",
      defaultValue: "Andi Susanto",
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "nama bank",
      name: "bankName",
      type: "text",
      defaultValue: "Bank Mandiri",
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-default" },
      label: "nomor rekening",
      name: "noRek",
      type: "text",
      defaultValue: "21414234",
    }),
    objectFields({
      label: "komisi penjualan (%)",
      name: "commission",
      type: "number",
      defaultValue: 10,
    }),
  ];

  return { fields };
};

export default Profile;
