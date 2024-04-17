import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import Template from "./Template";
import { ReqCourierInternal, useCourier } from "src/api/courier.service";
import { useForm } from "react-hook-form";
import { handleErrorMessage } from "src/helpers";
import { toast } from "react-toastify";
import { Spinner } from "@nextui-org/react";

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
          key={v.label}
          {...v}
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

  const { createCourierInternal } = useCourier();

  const onSubmit = handleSubmit(async (e) => {
    try {
      await createCourierInternal.mutateAsync(e);
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
        const values = getValues();
        await createCourierInternal.mutateAsync(values);
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
    isPending: createCourierInternal.isPending,
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
