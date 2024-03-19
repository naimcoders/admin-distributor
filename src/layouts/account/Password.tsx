import Template from "./Template";
import { FieldValues, useForm } from "react-hook-form";
import { Textfield } from "src/components/Textfield";
import { handleErrorMessage } from "src/helpers";
import { useLogin } from "src/pages/Index";

const Password = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({ mode: "onChange" });

  const onSubmit = handleSubmit(async (e) => {
    console.log(e);
  });

  const { logins } = useLogin();

  return (
    <Template
      title="perbarui password"
      onClick={onSubmit}
      btnLabelForm="buat baru"
    >
      {logins.map((el, idx) => (
        <Textfield
          {...el}
          key={idx}
          defaultValue=""
          control={control}
          className="w-full"
          placeholder={el.placeholder}
          autoComplete={el.autoComplete}
          errorMessage={handleErrorMessage(errors, el.name ?? "")}
          rules={{ required: { value: true, message: el.errorMessage ?? "" } }}
        />
      ))}
    </Template>
  );
};

export default Password;
