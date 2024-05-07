import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { Fragment } from "react";
import { Button } from "src/components/Button";
import { handleErrorMessage } from "src/helpers";
import { LabelAndImage } from "src/components/File";
import { Distributor } from "src/api/distributor.service";
import { UserCoordinate } from "src/components/Coordinate";
import { useDetailDistributorApi } from "./Profile";
import Error from "src/components/Error";
import Skeleton from "src/components/Skeleton";
import { FieldValues } from "react-hook-form";
import { Spinner } from "@nextui-org/react";

interface Business {
  distributorId: string;
  distributor: Distributor;
  isLoading?: boolean;
  error?: string;
}

const Business = ({
  distributor,
  error,
  isLoading,
  distributorId,
}: Business) => {
  const { fields } = useHook(distributor);
  const { forms, isPending, onSubmit } = useDetailDistributorApi(
    distributorId,
    distributor
  );

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : isLoading ? (
        <Skeleton />
      ) : (
        <main className="mt-5 flexcol gap-8">
          <section className="grid lg:grid-cols-3 gap-4 lg:gap-8 grid-cols-1">
            {fields.map((v, idx) => (
              <Fragment key={idx}>
                {["text"].includes(v.type!) && (
                  <Textfield
                    {...v}
                    control={forms.control}
                    errorMessage={handleErrorMessage(
                      forms.formState.errors,
                      v.name
                    )}
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

          <Button
            label={
              isPending ? <Spinner color="secondary" size="sm" /> : "simpan"
            }
            className="mx-auto mt-5"
            onClick={onSubmit}
          />
        </main>
      )}
    </>
  );
};

const useHook = (data?: Distributor) => {
  const fields: TextfieldProps<FieldValues>[] = [
    objectFields({
      label: "nama usaha",
      name: "name",
      type: "text",
      defaultValue: data?.name,
    }),
    objectFields({
      label: "alamat usaha",
      name: "businessAddress",
      type: "text",
      defaultValue: data?.locations?.[0]?.addressName,
      readOnly: { isValue: true, cursor: "cursor-default" },
      description: "*tidak dapat diedit",
    }),
    objectFields({
      label: "alamat detail",
      name: "detailAddress",
      type: "text",
      defaultValue: data?.locations?.[0]?.detailAddress,
      readOnly: { isValue: true, cursor: "cursor-default" },
      description: "*tidak dapat diedit",
    }),
    objectFields({
      label: "koordinat usaha",
      name: "coordinate",
      type: "coordinate",
      defaultValue: {
        lat: data?.locations?.[0]?.lat,
        lng: data?.locations?.[0]?.lng,
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
