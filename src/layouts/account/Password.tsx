import { FieldValues, useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Textfield } from "src/components/Textfield";
import { handleErrorMessage } from "src/helpers";
import { arrLogins } from "src/pages/Index";

const Password = () => {
  const {
    control,
    formState: { errors },
  } = useForm<FieldValues>({ mode: "onChange" });

  return (
    <main className="p-5 bg-white rounded-lg lg:w-calcLogin flexcol gap-6">
      <h1 className="font-interBold text-xl">Perbarui Password</h1>

      <section className="flexcol gap-1">
        {arrLogins.map((el, idx) => (
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
            className="mb-4"
          />
        ))}
      </section>

      <div className="flex justify-end">
        <Button aria-label="buat baru" />
      </div>
    </main>
  );
};

export default Password;
