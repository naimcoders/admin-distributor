import tokoroti from "src/assets/images/toko_roti.jpg";
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
import { UserCoordinate } from "src/components/Coordinate";
import { Location, useDistributor } from "src/api/distributor.service";
import { useParams } from "react-router-dom";
import Error from "src/components/Error";
import Skeleton from "src/components/Skeleton";

const Business = () => {
  const {
    control,
    formState: { errors },
  } = useForm<FieldValues>({ mode: "onChange" });
  const { fields, error, isLoading } = useHook();

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : isLoading ? (
        <Skeleton />
      ) : (
        <main className="mt-5 flexcol gap-8">
          <GridInput>
            {fields.map((v, idx) => (
              <Fragment key={idx}>
                {["text", "number", "email"].includes(v.type!) && (
                  <Textfield
                    type={v.type}
                    name={v.name}
                    label={v.label}
                    control={control}
                    placeholder={v.placeholder}
                    defaultValue={v.defaultValue}
                    errorMessage={handleErrorMessage(errors, v.name)}
                    rules={{
                      required: { value: true, message: v.errorMessage ?? "" },
                    }}
                  />
                )}

                {["modal"].includes(v.type!) && (
                  <Textfield
                    name={v.name!}
                    label={v.label}
                    control={control}
                    readOnly={v.readOnly}
                    placeholder={v.placeholder}
                    defaultValue={v.defaultValue}
                    errorMessage={handleErrorMessage(errors, v.name)}
                    rules={{
                      required: { value: true, message: v.errorMessage ?? "" },
                    }}
                    endContent={<ChevronRightIcon width={16} />}
                  />
                )}
              </Fragment>
            ))}
          </GridInput>

          <GridInput className="grid-cols-3">
            {fields.map((v, idx) => (
              <Fragment key={idx}>
                {["coordinate"].includes(v.type!) && (
                  <UserCoordinate
                    label={v.label}
                    lat={v.defaultValue.lat}
                    lng={v.defaultValue.lng}
                    onClick={v.onClick}
                  />
                )}

                {["image"].includes(v.type!) && (
                  <LabelAndImage label={v.label} src={String(v.defaultValue)} />
                )}
              </Fragment>
            ))}
          </GridInput>

          <div className="flex justify-center mt-10">
            <Button aria-label="simpan" />
          </div>
        </main>
      )}
    </>
  );
};

const useHook = () => {
  const { id } = useParams() as { id: string };
  const { data, error, isLoading } = useDistributor().findById(id);
  const { province, detailAddress, city, zipCode, district, lat, lng } = data
    ?.details.location[0] as Location;

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
      defaultValue: `${province}, ${city}, ${district}, ${zipCode}`,
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
      defaultValue: detailAddress,
    }),
    objectFields({
      label: "koordinat usaha",
      name: "coordinate",
      type: "coordinate",
      defaultValue: { lat, lng },
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
      defaultValue: data?.banner,
    }),
  ];

  return { fields, error, isLoading };
};

export default Business;
