import React from "react";
import Template from "./Template";
import { useForm } from "react-hook-form";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { handleErrorMessage } from "src/helpers";
import { checkPassword } from "src/pages/Index";
import { setUser } from "src/stores/auth";
import { useDistributor } from "src/api/distributor.service";

interface DefaultValues {
  email: string;
  password: string;
  oldPassword: string;
}

const Password = () => {
  const { control, errors, isPending, onSubmit } = useApi();
  const { fields } = useFields();

  return (
    <Template
      title="perbarui password"
      onClick={onSubmit}
      btnLabelForm={isPending ? "loading..." : "buat baru"}
    >
      {fields.map((el, idx) => (
        <Textfield
          {...el}
          key={idx}
          defaultValue=""
          control={control}
          errorMessage={handleErrorMessage(errors, el.name ?? "")}
          rules={{ required: { value: true, message: el.errorMessage ?? "" } }}
        />
      ))}
    </Template>
  );
};

const useApi = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DefaultValues>();
  const user = setUser((v) => v.user);

  const { updateDistributor } = useDistributor();

  const onSubmit = handleSubmit(async (e) => {
    if (!user) return;

    try {
      const obj = {
        name: user.name,
        ownerName: user.ownerName,
        email: e.email,
        password: e.password,
        oldPassword: e.oldPassword,
        phoneNumber: user.phoneNumber,
      };
      await updateDistributor.mutateAsync({ data: obj });
    } catch (e) {
      const error = e as Error;
      console.error(`Failed to update account : ${error.message}`);
    }
  });

  return { onSubmit, control, errors, isPending: updateDistributor.isPending };
};

const useFields = () => {
  const [isPassword, setIsPassword] = React.useState(false);
  const [isOldPassword, setIsOldPassword] = React.useState(false);

  const fields: TextfieldProps[] = [
    objectFields({
      label: "email",
      name: "email",
      type: "email",
      autoComplete: "on",
    }),
    objectFields({
      label: "password lama",
      name: "oldPassword",
      type: !isOldPassword ? "password" : "text",
      endContent: checkPassword(isOldPassword, setIsOldPassword),
    }),
    objectFields({
      label: "password baru",
      name: "password",
      type: !isPassword ? "password" : "text",
      endContent: checkPassword(isPassword, setIsPassword),
    }),
  ];

  return { fields };
};

export default Password;
