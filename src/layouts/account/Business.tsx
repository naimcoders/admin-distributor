import React from "react";
import Template from "./Template";
import { setUser } from "src/stores/auth";
import { Textfield } from "src/components/Textfield";
import { useForm } from "react-hook-form";
import { handleErrorMessage, setFieldRequired } from "src/helpers";
import Coordinate, { UserCoordinate } from "src/components/Coordinate";
import { useActiveModal } from "src/stores/modalStore";
import { Modal } from "src/components/Modal";

interface IDefaultValues {
  name: string;
  addressName: string;
  detailAddress: string;
}

const Business = () => {
  const [latLng, setLatLng] = React.useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  const form = useForm<IDefaultValues>();
  const user = setUser((v) => v.user);

  const { actionIsCoordinate, isCoordinate } = useActiveModal();

  const onSubmit = form.handleSubmit(async (e) => {
    console.log(e, latLng);
  });

  React.useEffect(() => {
    setLatLng({
      lat: user?.locations[0].lat ?? 0,
      lng: user?.locations[0].lng ?? 0,
    });
  }, [user]);

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
          lat={latLng.lat}
          lng={latLng.lng}
          zoom={19}
          onClick={actionIsCoordinate}
        />
      </section>

      <Modal isOpen={isCoordinate} closeModal={actionIsCoordinate}>
        <Coordinate
          zoom={19}
          setCoordinate={(e) => setLatLng({ lat: e.lat, lng: e.lng })}
          lat={latLng.lat}
          lng={latLng.lng}
        />
      </Modal>
    </Template>
  );
};

export default Business;
