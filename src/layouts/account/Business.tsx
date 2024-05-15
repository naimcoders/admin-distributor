import React from "react";
import Template from "./Template";
import { setUser } from "src/stores/auth";
import { Textfield } from "src/components/Textfield";
import { useForm } from "react-hook-form";
import { handleErrorMessage, setFieldRequired } from "src/helpers";
import Coordinate, { UserCoordinate } from "src/components/Coordinate";
import { useActiveModal } from "src/stores/modalStore";
import { Modal } from "src/components/Modal";
import { createLocation, findGeoLocation } from "src/api/location.service";
import { Spinner } from "@nextui-org/react";
import { toast } from "react-toastify";
import { updateDistributor } from "src/api/distributor.service";

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

  const { actionIsCoordinate, isCoordinate } = useActiveModal();

  const form = useForm<IDefaultValues>();
  const user = setUser((v) => v.user);

  const geoLocation = findGeoLocation(latLng.lat, latLng.lng);
  const createNewLocation = createLocation();
  const updateMyAccount = updateDistributor();

  React.useEffect(() => {
    setLatLng({
      lat: user?.locations[0].lat ?? 0,
      lng: user?.locations[0].lng ?? 0,
    });
  }, [user]);

  const onSubmit = form.handleSubmit(async (e) => {
    if (!user) return;
    const location = user.locations?.[0];
    const lat = location.lat;
    const lng = location.lng;

    if (lat === latLng.lat && lng === latLng.lng) {
      // try {
      //   await createNewLocation.mutateAsync(location);
      // } catch (e) {
      //   const error = e as Error;
      //   toast.error(`Error to update location: ${error.message}`);
      // }
      console.log("Lokasi tidak perlu diperbarui");
    } else {
      if (!geoLocation.data) return;
      const data = geoLocation.data;
      try {
        await createNewLocation.mutateAsync({
          ...data,
          id: "",
        });
        toast.success("lokasi berhasil diperbarui");
      } catch (e) {
        const error = e as Error;
        toast.error(`Error to create a new location: ${error.message}`);
      }
    }

    try {
      toast.loading("Loading...", { toastId: "loading-update-business" });
      await updateMyAccount.mutateAsync({
        name: e.name,
        ownerName: user.ownerName,
        phoneNumber: user.phoneNumber,
      });
      toast.success("Data berhasil diperbarui");
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to update: ${error.message}`);
    } finally {
      toast.dismiss("loading-update-business");
    }
  });

  return (
    <Template
      title="usaha"
      onClick={onSubmit}
      btnLabelForm={
        updateMyAccount.isPending ? (
          <Spinner color="secondary" size="sm" />
        ) : (
          "simpan"
        )
      }
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
