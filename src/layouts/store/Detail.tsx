import React from "react";
import Error from "src/components/Error";
import Skeleton from "src/components/Skeleton";
import { FieldValues, useForm } from "react-hook-form";
import { HiCheckCircle } from "react-icons/hi2";
import { Textfield } from "src/components/Textfield";
import { LabelAndImage } from "src/components/File";
import { UserCoordinate } from "src/components/Coordinate";
import { findStoreById } from "src/api/store.service";
import { useParams } from "react-router-dom";
import {
  epochToDateConvert,
  handleErrorMessage,
  parsePhoneNumber,
} from "src/helpers";
import { IconColor } from "src/types";
import { getFileFromFirebase } from "src/firebase/upload";

const Detail = () => {
  const [ktpImage, setKtpImage] = React.useState<string | undefined>("");

  const {
    control,
    formState: { errors },
  } = useForm<FieldValues>();
  const { id } = useParams() as { id: string };
  const { data, isLoading, error } = findStoreById(id);
  const location = data?.locations?.[0];
  const storeAddress = `${location?.province}, ${location?.city}, ${location?.district}, ${location?.zipCode}`;

  React.useEffect(() => {
    if (data) {
      getFileFromFirebase(data.ktpImageUrl).then((path) => setKtpImage(path));
    }
  }, [data]);

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : isLoading ? (
        <Skeleton />
      ) : (
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 gap-4">
          <Textfield
            type="text"
            label="nama pemilik"
            control={control}
            name="name"
            placeholder="Masukkan nama pemilik"
            defaultValue={data?.ownerName}
            errorMessage={handleErrorMessage(errors, "ownerName")}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />

          <Textfield
            type="number"
            label="nomor HP"
            control={control}
            name="phoneNumber"
            placeholder="Masukkan nomor HP"
            defaultValue={parsePhoneNumber(data?.phoneNumber)}
            errorMessage={handleErrorMessage(errors, "phoneNumber")}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />

          <Textfield
            name="email"
            type="email"
            label="email"
            control={control}
            placeholder="Masukkan email"
            defaultValue={data?.email}
            errorMessage={handleErrorMessage(errors, "email")}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
            endContent={
              data?.emailVerify && (
                <HiCheckCircle size={20} color={IconColor.green} />
              )
            }
          />

          <Textfield
            name="createdAt"
            type="text"
            label="tanggal join"
            control={control}
            defaultValue={epochToDateConvert(data?.createdAt)}
            errorMessage={handleErrorMessage(errors, "createdAt")}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />

          <Textfield
            name="storeName"
            type="text"
            label="nama toko"
            control={control}
            defaultValue={data?.storeName}
            errorMessage={handleErrorMessage(errors, "storeName")}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />

          <Textfield
            name="storeAddress"
            type="text"
            label="alamat toko"
            control={control}
            defaultValue={storeAddress}
            errorMessage={handleErrorMessage(errors, "storeAddress")}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />

          <Textfield
            name="streetName"
            type="text"
            label="nama jalan, gedung, no. rumah"
            control={control}
            defaultValue={location?.addressName}
            errorMessage={handleErrorMessage(errors, "streetName")}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />

          <Textfield
            name="detailAddress"
            type="text"
            label="detail alamat"
            control={control}
            defaultValue={location?.detailAddress}
            errorMessage={handleErrorMessage(errors, "detailAddress")}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />

          <Textfield
            name="rating"
            type="text"
            label="rating"
            control={control}
            defaultValue={data?.rate}
            errorMessage={handleErrorMessage(errors, "rating")}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />

          <Textfield
            name="verify"
            type="text"
            label="status akun"
            control={control}
            defaultValue={data?.isVerify ? "Verified" : "Unverified"}
            errorMessage={handleErrorMessage(errors, "verify")}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />

          <UserCoordinate
            lat={location?.lat ?? 0}
            lng={location?.lng ?? 0}
            label="koordinat toko"
          />

          <LabelAndImage src={ktpImage ?? ""} label="KTP pemilik" />
          <LabelAndImage src={data?.banner ?? ""} label="banner etalase" />
        </main>
      )}
    </>
  );
};

export default Detail;
