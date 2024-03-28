// import tokoroti from "src/assets/images/toko_roti.jpg";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { FieldValues, useForm } from "react-hook-form";
import { Fragment } from "react";
import { Button } from "src/components/Button";
import { handleErrorMessage } from "src/helpers";
import { LabelAndImage } from "src/components/File";
import { Distributor } from "src/api/distributor.service";
import Error from "src/components/Error";
import Skeleton from "src/components/Skeleton";
import { UserCoordinate } from "src/components/Coordinate";
import { Chip } from "@nextui-org/react";

interface Business {
  distributor?: Distributor;
  isLoading?: boolean;
  error?: string;
}

const Business = ({ distributor, error, isLoading }: Business) => {
  const {
    control,
    formState: { errors },
  } = useForm<FieldValues>({ mode: "onChange" });
  const { fields } = useHook(distributor);

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : isLoading ? (
        <Skeleton />
      ) : (
        <main className="mt-5 flexcol gap-8">
          <section className="grid lg:grid-cols-2 gap-4 lg:gap-8 grid-cols-1">
            {fields.map((v, idx) => (
              <Fragment key={idx}>
                {["text", "number"].includes(v.type!) && (
                  <Textfield
                    {...v}
                    control={control}
                    errorMessage={handleErrorMessage(errors, v.name)}
                    rules={{
                      required: { value: true, message: v.errorMessage ?? "" },
                    }}
                  />
                )}
              </Fragment>
            ))}
          </section>

          <section className="grid-cols-4 grid lg:gap-8 gap-4">
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
          </section>

          <section className="flex flex-col gap-3">
            <Chip color="default">{distributor?.locations[0].addressName}</Chip>
            <Chip color="default">
              Alamat detail : {distributor?.locations[0].detailAddress}
            </Chip>
          </section>

          <div className="flex justify-center mt-10">
            <Button aria-label="simpan" />
          </div>
        </main>
      )}
    </>
  );
};

const useHook = (data?: Distributor) => {
  const fields: TextfieldProps[] = [
    objectFields({
      label: "nama usaha",
      name: "businessName",
      type: "text",
      defaultValue: data?.name,
    }),
    objectFields({
      label: "detail alamat",
      name: "detailAddress",
      type: "text",
      defaultValue: data?.locations[0]?.detailAddress,
    }),
    objectFields({
      label: "koordinat usaha",
      name: "coordinate",
      type: "coordinate",
      onClick: () => console.log("koordinate usaha"),
      defaultValue: {
        lat: data?.locations[0]?.lat,
        lng: data?.locations[0]?.lng,
      },
    }),
    objectFields({
      label: "logo usaha",
      name: "businessLogo",
      type: "image",
      defaultValue: data?.imageUrl,
    }),
    objectFields({
      label: "banner etalase",
      name: "banner",
      type: "image",
      defaultValue: data?.banner,
    }),
  ];

  return { fields };
};

export default Business;
