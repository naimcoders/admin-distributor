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
  const { control, errors, onSubmit, isPending } = useApi();

  return (
    <Template
      title="kurir internal"
      btnLabelForm={isPending ? <Spinner color="secondary" /> : "buat kurir"}
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
    formState: { errors },
  } = useForm<ReqCourierInternal>();

  const { createCourierInternal } = useCourier();

  const onSubmit = handleSubmit(async (e) => {
    try {
      await createCourierInternal.mutateAsync(e);
      reset();
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to create courier internal: ${error.message}`);
      console.error(`Failed to create courier internal: ${error.message}`);
    }
  });

  return {
    control,
    errors,
    onSubmit,
    isPending: createCourierInternal.isPending,
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
