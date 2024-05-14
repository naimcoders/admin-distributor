import React from "react";
import Template from "./Template";
import { setUser } from "src/stores/auth";
import { Textfield } from "src/components/Textfield";
import { useForm } from "react-hook-form";
import { handleErrorMessage, setFieldRequired } from "src/helpers";
import Coordinate, { UserCoordinate } from "src/components/Coordinate";

interface IDefaultValues {
  name: string;
  addressName: string;
  detailAddress: string;
}

const Business = () => {
  const form = useForm<IDefaultValues>();
  const user = setUser((v) => v.user);

  const onSubmit = form.handleSubmit(async (e) => {
    console.log(e);
  });

  if (!user) return;

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
        <Textfield
          name="detailAddress"
          label="detail alamat"
          control={form.control}
          defaultValue={user?.locations?.[0].detailAddress}
          placeholder="masukkan detail alamat"
          rules={{
            required: setFieldRequired(true, "masukkan detail alamat"),
          }}
          errorMessage={handleErrorMessage(
            form.formState.errors,
            "detailAddress"
          )}
          readOnly={{ isValue: true, cursor: "cursor-default" }}
        />
        <Textfield
          name="addressName"
          label="alamat"
          control={form.control}
          defaultValue={user?.locations?.[0].addressName}
          placeholder="atur alamat"
          rules={{
            required: setFieldRequired(true, "atur alamat"),
          }}
          errorMessage={handleErrorMessage(
            form.formState.errors,
            "addressName"
          )}
          readOnly={{ isValue: true, cursor: "cursor-default" }}
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
        <UserCoordinate
          label="maps"
          lat={user.locations[0].lat}
          lng={user.locations[0].lng}
        />
      </section>
    </Template>
  );
};

export default Business;
