import React from "react";
import Template from "./Template";
import { setUser } from "src/stores/auth";
import { Textfield } from "src/components/Textfield";
import { useForm } from "react-hook-form";
import { handleErrorMessage, setFieldRequired } from "src/helpers";

interface IDefaultValues {
  name: string;
}

const Business = () => {
  const form = useForm<IDefaultValues>();
  const user = setUser((v) => v.user);

  const onSubmit = form.handleSubmit(async (e) => {
    console.log(e);
  });

  return (
    <Template
      title="usaha"
      onClick={onSubmit}
      btnLabelForm="simpan"
      className="max-w-full"
    >
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        <Textfield
          name="name"
          label="nama"
          control={form.control}
          defaultValue={user?.name}
          placeholder="Masukkan nama"
          rules={{
            required: setFieldRequired(true, "masukkan nama"),
          }}
          errorMessage={handleErrorMessage(form.formState.errors, "name")}
        />
      </section>
    </Template>
  );
};

export default Business;
