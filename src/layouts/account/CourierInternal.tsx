import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import Template from "./Template";
import {
  ReqCourierInternal,
  createCourierInternal,
} from "src/api/courier.service";
import { useForm } from "react-hook-form";
import { handleErrorMessage } from "src/helpers";
import { toast } from "react-toastify";
import { Spinner } from "@nextui-org/react";
import { findLocationByUserId } from "src/api/location.service";

const CourierInternal = () => {
  const { rekenings } = useHook();
  const { control, errors, onSubmit, isPending, onSubmitKeyDown } = useApi();

  return (
    <Template
      title="kurir internal"
      btnLabelForm={
        isPending ? <Spinner color="secondary" size="sm" /> : "buat kurir"
      }
      onClick={onSubmit}
    >
      {rekenings.map((v) => (
        <Textfield
          {...v}
          key={v.label}
          defaultValue=""
          control={control}
          errorMessage={handleErrorMessage(errors, v.name)}
          rules={{
            required: { value: true, message: v.errorMessage ?? "" },
          }}
          onKeyDown={onSubmitKeyDown}
        />
      ))}
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

  // const { createCourierInternal } = useCourier();
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

const useHook = () => {
  const rekenings: TextfieldProps<ReqCourierInternal>[] = [
    objectFields({
      name: "name",
      label: "nama lengkap",
      type: "text",
    }),
    objectFields({
      name: "email",
      label: "email",
      type: "email",
      autoComplete: "on",
    }),
    objectFields({
      name: "phoneNumber",
      label: "nomor HP",
      type: "number",
    }),
  ];

  return { rekenings };
};

export default CourierInternal;
