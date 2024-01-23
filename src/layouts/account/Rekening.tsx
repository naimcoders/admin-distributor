import { GeneralFields, Textfield } from "src/components/Textfield";
import Template from "./Template";
import { FieldValues, useForm } from "react-hook-form";
import { handleErrorMessage } from "src/helpers";

const Rekening = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({ mode: "onChange" });

  const onSubmit = handleSubmit(async (e) => {
    console.log(e);
  });

  return (
    <Template title="detail rekening" onClick={onSubmit} btnLabelForm="simpan">
      {rekenings.map((el, idx) => (
        <Textfield
          key={idx}
          name={el.name}
          type={el.type}
          label={el.label}
          defaultValue=""
          control={control}
          placeholder={el.placeholder}
          autoComplete={el.autoComplete}
          errorMessage={handleErrorMessage(errors, el.name)}
          rules={{ required: { value: true, message: el.errorMessage } }}
        />
      ))}
    </Template>
  );
};

const rekenings: GeneralFields[] = [
  {
    label: "nama lengkap",
    autoComplete: "off",
    name: "fullname",
    type: "text",
    placeholder: "masukkan nama sesuai rekening",
    errorMessage: "masukkan nama sesuai rekening",
  },
  {
    label: "nomor rekening",
    autoComplete: "off",
    name: "noRek",
    type: "number",
    placeholder: "masukkan nomor rekening",
    errorMessage: "masukkan nomor rekening",
  },
];

export default Rekening;
