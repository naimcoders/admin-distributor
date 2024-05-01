import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import Template from "./Template";
import {
  ReqCourierInternal,
  createCourierInternal,
  findMyCourier,
} from "src/api/courier.service";
import { useForm } from "react-hook-form";
import { handleErrorMessage, parsePhoneNumber } from "src/helpers";
import { toast } from "react-toastify";
import { Spinner } from "@nextui-org/react";
import { findLocationByUserId } from "src/api/location.service";
import { setUser } from "src/stores/auth";

// TODO:
// 1. FIX THE SIZE OF HEADER LAYOUT
// 2. FIX SCROLL TABLE
// 3. FIX COURIER INTERNAL WHEN POST & PUT

const CourierInternal = () => {
  const { control, errors, onSubmit, isPending, onSubmitKeyDown } = useApi();

  const user = setUser((v) => v.user);
  const { data, isLoading } = findMyCourier(user?.id ?? "");

  const rekenings: TextfieldProps<ReqCourierInternal>[] = [
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
      type: "text",
      defaultValue: parsePhoneNumber(data?.phoneNumber),
    }),
  ];

  return (
    <Template
      title="kurir internal"
      btnLabelForm={
        isPending ? <Spinner color="secondary" size="sm" /> : "buat kurir"
      }
      onClick={onSubmit}
    >
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        rekenings.map((v) => (
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

const useApi = () => {
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ReqCourierInternal>();

  const createCourier = createCourierInternal();
  const { data } = findLocationByUserId();

  const onSubmit = handleSubmit(async (e) => {
    try {
      if (!data) return;

      await createCourier.mutateAsync({
        email: e.email,
        name: e.name,
        phoneNumber: e.phoneNumber,
        location: data[0],
      });
      toast.success("Kurir internal berhasil dibuat");
      reset();
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to create courier internal: ${error.message}`);
    }
  });

  const onSubmitKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      try {
        if (!data) return;
        const values = getValues();

        const obj = {
          ...values,
          location: data[0],
        };

        await createCourier.mutateAsync(obj);
        toast.success("Kurir internal berhasil dibuat");
        reset();
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
