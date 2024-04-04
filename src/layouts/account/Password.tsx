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

interface DefaultValues {
  email: string;
  password: string;
  oldPassword: string;
}

const Password = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DefaultValues>();

  const { fields } = useFields();
  const user = setUser((v) => v.user);

  const onSubmit = handleSubmit(async (e) => {
    const obj = {
      name: user?.name,
      ownerName: user?.ownerName,
      email: e.email,
      password: e.password,
      oldPassword: e.oldPassword,
      phoneNumber: user?.phoneNumber,
    };
    console.log(obj);
  });

  return (
    <Template
      title="perbarui password"
      onClick={onSubmit}
      btnLabelForm="buat baru"
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
