import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import Template from "./Template";
import {
  Courier,
  ReqCourierInternal,
  createCourierInternal,
  findMyCourier,
  updateCourierInternal,
} from "src/api/courier.service";
import { useForm } from "react-hook-form";
import { handleErrorMessage, parsePhoneNumber } from "src/helpers";
import { toast } from "react-toastify";
import { Spinner } from "@nextui-org/react";
import { findLocationByUserId } from "src/api/location.service";
import { setUser } from "src/stores/auth";

const CourierInternal = () => {
  const user = setUser((v) => v.user);
  const { data, isLoading } = findMyCourier(user?.id ?? "");
  const { control, errors, onSubmit, isPending, onSubmitKeyDown } =
    useApi(data);

  const couriers: TextfieldProps<ReqCourierInternal>[] = [
    objectFields({
      name: "name",
      label: "nama lengkap",
      type: "text",
      defaultValue: data?.name ?? "",
    }),
    objectFields({
      name: "email",
      label: "email",
      type: "email",
      autoComplete: "on",
      defaultValue: data?.email,
    }),
    objectFields({
      name: "phoneNumber",
      label: "nomor HP",
      type: "number",
      defaultValue: data?.phoneNumber
        ? parsePhoneNumber(data?.phoneNumber)
        : "",
    }),
  ];

  return (
    <Template
      title="kurir internal"
      btnLabelForm={
        isPending ? (
          <Spinner color="secondary" size="sm" />
        ) : !data?.name ? (
          "buat kurir"
        ) : (
          "perbarui kurir"
        )
      }
      onClick={onSubmit}
    >
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        couriers.map((v) => (
          <Textfield
            {...v}
            key={v.label}
            defaultValue={v.defaultValue}
            control={control}
            errorMessage={handleErrorMessage(errors, v.name)}
            rules={{
              required: { value: true, message: v.errorMessage ?? "" },
            }}
            onKeyDown={onSubmitKeyDown}
          />
        ))
      )}
    </Template>
  );
};

const useApi = (courierData?: Courier) => {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ReqCourierInternal>();

  const createCourier = createCourierInternal();
  const updateCourier = updateCourierInternal();
  const { data } = findLocationByUserId();

  const onSubmit = handleSubmit(async (e) => {
    try {
      if (!data) return;

      if (!courierData) {
        await createCourier.mutateAsync({
          email: e.email,
          name: e.name,
          phoneNumber: e.phoneNumber,
          location: data[0],
        });
        toast.success("Kurir internal berhasil dibuat");
      } else {
        await updateCourier.mutateAsync({
          email: e.email,
          name: e.name,
          phoneNumber: parsePhoneNumber(e.phoneNumber),
          location: data[0],
        });
        toast.success("Kurir internal berhasil diperbarui");
      }
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed courier internal: ${error.message}`);
    }
  });

  const onSubmitKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !courierData) {
      try {
        if (!data) return;
        const values = getValues();

        const obj = {
          ...values,
          location: data[0],
        };

        await createCourier.mutateAsync(obj);
        toast.success("Kurir internal berhasil dibuat");
      } catch (e) {
        const error = e as Error;
        toast.error(`Failed to create courier internal: ${error.message}`);
      }
    }
  };

  return {
    control,
    errors,
    onSubmit,
    isPending: createCourier.isPending,
    onSubmitKeyDown,
  };
};

export default CourierInternal;
