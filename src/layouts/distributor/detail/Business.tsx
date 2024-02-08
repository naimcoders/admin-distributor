import tokoroti from "src/assets/images/toko_roti.jpg";
import bannerEtalase from "src/assets/images/banner_etalase.jpg";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { FieldValues, useForm } from "react-hook-form";
import { Fragment } from "react";
import { Button } from "src/components/Button";
import { handleErrorMessage } from "src/helpers";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { GridInput } from "src/layouts/Index";
import { LabelAndImage } from "src/components/File";
import { UserCoordinate, defaultCoordinate } from "src/components/Coordinate";

const Business = () => {
  const {
    control,
    formState: { errors },
  } = useForm<FieldValues>({ mode: "onChange" });
  const { fields } = useHook();

  return (
    <main className="mt-5 flexcol gap-8">
      <GridInput>
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
                description={v.description}
                errorMessage={handleErrorMessage(errors, v.name)}
                rules={{ required: { value: true, message: v.errorMessage! } }}
              />
            )}

            {["modal"].includes(v.type!) && (
              <Textfield
                name={v.name!}
                label={v.label}
                control={control}
                readOnly={v.readOnly}
                placeholder={v.placeholder}
                autoComplete={v.autoComplete}
                defaultValue={v.defaultValue}
                errorMessage={handleErrorMessage(errors, v.name)}
                rules={{ required: { value: true, message: v.errorMessage! } }}
                endContent={<ChevronRightIcon width={16} />}
              />
            )}
          </Fragment>
        ))}
      </GridInput>

      <section className="grid grid-cols-4 gap-x-8 gap-y-10">
        {fields.map((v, idx) => (
          <Fragment key={idx}>
            {["coordinate"].includes(v.type!) && (
              <UserCoordinate
                label={v.label!}
                lat={v.defaultValue.lat}
                lng={v.defaultValue.lng}
                onClick={v.onClick}
              />
            )}

            {["image"].includes(v.type!) && (
              <LabelAndImage label={v.label!} src={String(v.defaultValue)} />
            )}
          </Fragment>
        ))}
      </section>

      <div className="flex justify-center mt-10">
        <Button aria-label="simpan" />
      </div>
    </main>
  );
};

const useHook = () => {
  const fields: TextfieldProps[] = [
    objectFields({
      label: "nama usaha",
      name: "businessName",
      type: "text",
      defaultValue: "Arta Boga",
    }),
    objectFields({
      label: "alamat usaha",
      name: "businessAddress",
      type: "modal",
      defaultValue: "SULAWESI SELATAN, KOTA MAKASSAR",
      readOnly: { isValue: true, cursor: "cursor-pointer" },
    }),
    objectFields({
      label: "nama jalan, gedung, no. rumah",
      name: "street",
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
      label: "koordinat usaha",
      name: "coordinate",
      type: "coordinate",
      defaultValue: defaultCoordinate,
      onClick: () => console.log("koordinate usaha"),
    }),
    objectFields({
      label: "logo usaha",
      name: "businessLogo",
      type: "image",
      defaultValue: tokoroti,
    }),
    objectFields({
      label: "banner etalase",
      name: "banner",
      type: "image",
      defaultValue: bannerEtalase,
    }),
  ];

  return { fields };
};

export default Business;
