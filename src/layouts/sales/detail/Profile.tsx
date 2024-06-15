import {
  HiOutlineArrowUpTray,
  HiOutlineChevronRight,
  HiOutlineTrash,
} from "react-icons/hi2";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Textfield } from "src/components/Textfield";
import { useKtp } from "../Create";
import { File, LabelAndImage } from "src/components/File";
import {
  handleErrorMessage,
  parsePhoneNumber,
  setRequiredField,
} from "src/helpers";
import { IconColor } from "src/types";
import { findSalesById } from "src/api/sales.service";
import { useParams } from "react-router-dom";
import Error from "src/components/Error";
import Skeleton from "src/components/Skeleton";
import { getFileFromFirebase } from "src/firebase/upload";

const Profile = () => {
  const { id } = useParams() as { id: string };

  const {
    control,
    // setValue,
    // clearErrors,
    formState: { errors },
  } = useForm<FieldValues>();

  const {
    ktpBlob,
    ktpRef,
    onClick,
    onChange,
    setKtpBlob,
    // ktpFiles,
    // setKtpFiles,
  } = useKtp();

  const salesById = findSalesById(id);

  React.useEffect(() => {
    if (salesById.data) {
      setKtpBlob(salesById.data.ktpImage);
    }
  }, [salesById.data]);

  React.useEffect(() => {
    if (salesById.data) {
      getFileFromFirebase(salesById.data.ktpImage).then((path) =>
        setKtpBlob(path ?? "")
      );
    }
  }, [salesById.data]);

  return (
    <main>
      {salesById.error && <Error error={salesById.error.message} />}
      {salesById.isLoading ? (
        <Skeleton />
      ) : (
        <section className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-2 lg:gap-8 gap-4">
          <Textfield
            type="text"
            label="nama sales"
            control={control}
            name="name"
            placeholder="Masukkan nama sales"
            defaultValue={salesById.data?.name}
            errorMessage={handleErrorMessage(errors, "name")}
            rules={{ required: setRequiredField(true, "Masukkan nama sales") }}
            className="w-full"
          />

          <Textfield
            type="number"
            label="nomor HP"
            control={control}
            name="phoneNumber"
            placeholder="Masukkan nomor HP sales"
            defaultValue={parsePhoneNumber(salesById.data?.phoneNumber)}
            errorMessage={handleErrorMessage(errors, "phoneNumber")}
            rules={{ required: setRequiredField(true, "Masukkan nomor HP") }}
            className="w-full"
          />

          <Textfield
            type="email"
            label="email"
            control={control}
            name="email"
            autoComplete="on"
            placeholder="Masukkan alamat email"
            defaultValue={salesById.data?.email}
            errorMessage={handleErrorMessage(errors, "email")}
            rules={{ required: setRequiredField(true, "masukkan email") }}
            className="w-full"
          />

          <Textfield
            label="kategori"
            control={control}
            name="category"
            placeholder="pilih kategori sales"
            defaultValue={salesById.data?.category
              .map((e) => e.name)
              .join(", ")}
            errorMessage={handleErrorMessage(errors, "category")}
            rules={{ required: setRequiredField(true, "pilih kategori") }}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-pointer" }}
            // onClick={onCloseModal}
            endContent={<HiOutlineChevronRight size={16} />}
          />

          <Textfield
            label="komisi penjualan (%)"
            control={control}
            name="comition"
            placeholder="masukkan komisi"
            defaultValue={salesById.data?.comition}
            errorMessage={handleErrorMessage(errors, "comition")}
            rules={{ required: setRequiredField(true, "masukkan komisi") }}
            className="w-full"
          />

          {!ktpBlob ? (
            <File
              name="ktp"
              label="KTP"
              control={control}
              placeholder="unggah KTP"
              ref={ktpRef}
              onClick={onClick}
              onChange={onChange}
              errorMessage={handleErrorMessage(errors, "ktp")}
              rules={{ required: setRequiredField(true, "unggah KTP") }}
              startContent={<HiOutlineArrowUpTray size={16} />}
            />
          ) : (
            <LabelAndImage
              src={ktpBlob}
              label="KTP"
              actions={[
                {
                  src: <HiOutlineTrash size={16} color={IconColor.red} />,
                  onClick: () => setKtpBlob(""),
                },
              ]}
            />
          )}

          <LabelAndImage
            src={salesById.data?.imageUrl ?? ""}
            label="foto sales"
            actions={[
              {
                src: <HiOutlineTrash size={16} color={IconColor.red} />,
                onClick: () => setKtpBlob(""),
              },
            ]}
          />
        </section>
      )}
    </main>
  );
};

export default Profile;
