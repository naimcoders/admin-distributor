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
  Currency,
  epochToDateConvert,
  parsePhoneNumber,
  setHoursEpochTime,
} from "src/helpers";
import { IconColor } from "src/types";
import { getFileFromFirebase } from "src/firebase/upload";
import ContentTextfield from "src/components/ContentTextfield";
import {
  findOrderCountSales,
  findRevenueSales,
} from "src/api/performance.service";
import { Spinner } from "@nextui-org/react";

const Detail = () => {
  const [ktpImage, setKtpImage] = React.useState<string | undefined>("");
  const { customerId } = useParams() as { customerId: string };

  const { control } = useForm<FieldValues>();

  const { data, isLoading, error } = findStoreById(customerId);
  const location = data?.locations?.[0];
  const storeAddress = `${location?.province}, ${location?.city}, ${location?.district}, ${location?.zipCode}`;

  const endAtEpoch = setHoursEpochTime(23, 59);
  const revenueSales = findRevenueSales({
    startAt: data?.createdAt ?? 0,
    endAt: endAtEpoch,
  });
  const orderCountSales = findOrderCountSales({
    startAt: data?.createdAt ?? 0,
    endAt: endAtEpoch,
  });

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
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 gap-4 mb-5">
          <Textfield
            type="text"
            label="nama pemilik"
            control={control}
            name="name"
            placeholder="Masukkan nama pemilik"
            defaultValue={data?.ownerName}
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
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />

          <Textfield
            name="storeName"
            type="text"
            label="nama toko"
            control={control}
            defaultValue={data?.storeName}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />

          <Textfield
            name="storeAddress"
            type="text"
            label="alamat toko"
            control={control}
            defaultValue={storeAddress}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />

          <Textfield
            name="streetName"
            type="text"
            label="nama jalan, gedung, no. rumah"
            control={control}
            defaultValue={location?.addressName}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />

          <Textfield
            name="detailAddress"
            type="text"
            label="detail alamat"
            control={control}
            defaultValue={location?.detailAddress}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />

          {revenueSales.error ? (
            <Error error={revenueSales.error} />
          ) : revenueSales.isLoading ? (
            <div>
              <Spinner size="md" />
            </div>
          ) : (
            <Textfield
              name="revenue"
              type="text"
              label="total revenue"
              control={control}
              defaultValue={Currency(revenueSales.data ?? 0)}
              className="w-full"
              readOnly={{ isValue: true, cursor: "cursor-default" }}
              startContent={<ContentTextfield label="Rp" />}
            />
          )}

          {orderCountSales.error ? (
            <Error error={orderCountSales.error} />
          ) : orderCountSales.isLoading ? (
            <div>
              <Spinner size="md" />
            </div>
          ) : (
            <Textfield
              name="orderCount"
              type="text"
              label="total transaksi"
              control={control}
              defaultValue={Currency(orderCountSales.data ?? 0)}
              className="w-full"
              readOnly={{ isValue: true, cursor: "cursor-default" }}
            />
          )}

          <Textfield
            name="rating"
            type="text"
            label="rating"
            control={control}
            defaultValue={data?.rate}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />

          <Textfield
            name="verify"
            type="text"
            label="status akun"
            control={control}
            defaultValue={data?.isVerify ? "Verified" : "Unverified"}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />

          <UserCoordinate
            lat={location?.lat ?? 0}
            lng={location?.lng ?? 0}
            label="koordinat toko"
            zoom={19}
          />

          <LabelAndImage src={ktpImage ?? ""} label="KTP pemilik" />
          <LabelAndImage src={data?.banner ?? ""} label="banner etalase" />
        </main>
      )}
    </>
  );
};

export default Detail;
