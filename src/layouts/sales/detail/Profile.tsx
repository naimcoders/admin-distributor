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
import { handleErrorMessage, setRequiredField } from "src/helpers";
import { IconColor } from "src/types";
import { findSalesById } from "src/api/sales.service";
import { useParams } from "react-router-dom";
import Error from "src/components/Error";
import Skeleton from "src/components/Skeleton";

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
            defaultValue={salesById.data?.phoneNumber}
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
            defaultValue=""
            errorMessage={handleErrorMessage(errors, "category")}
            rules={{ required: setRequiredField(true, "pilih kategori") }}
            className="w-full"
            readOnly={{ isValue: true, cursor: "cursor-pointer" }}
            // onClick={onCloseModal}
            endContent={<HiOutlineChevronRight size={16} />}
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
        </section>
      )}
    </main>
    // <GridInput className="mt-5">
    //   {fields.map((v, idx) => (
    //     <Fragment key={idx}>
    //       {["text", "number", "email"].includes(v.type!) && (
    //         <Textfield
    //           label={v.label}
    //           control={control}
    //           name={v.name ?? ""}
    //           placeholder={v.placeholder}
    //           defaultValue={v.defaultValue}
    //           autoComplete={v.autoComplete}
    //           readOnly={v.readOnly}
    //           description={v.description}
    //         />
    //       )}

    //       {["modal"].includes(v.type!) && (
    //         <Textfield
    //           name={v.name!}
    //           autoComplete={v.autoComplete}
    //           control={control}
    //           defaultValue={v.defaultValue}
    //           placeholder={v.placeholder}
    //           readOnly={v.readOnly}
    //           type="text"
    //           label={v.label}
    //           endContent={<HiOutlineChevronRight size={16} />}
    //           onClick={v.onClick}
    //         />
    //       )}

    //       {["file"].includes(v.type!) &&
    //         (!v.defaultValue ? (
    //           <File
    //             name={v.name}
    //             label={v.label}
    //             control={control}
    //             className="w-full"
    //             placeholder={v.placeholder}
    //             ref={v.uploadImage?.file.ref}
    //             onClick={v.uploadImage?.file.onClick}
    //             onChange={v.uploadImage?.file.onChange}
    //             startContent={<HiOutlineArrowUpTray size={16} />}
    //             errorMessage={handleErrorMessage(errors, v.name)}
    //             rules={{
    //               required: { value: true, message: v.errorMessage ?? "" },
    //             }}
    //           />
    //         ) : (
    //           <LabelAndImage src={v.defaultValue} label={v.label!} />
    //         ))}

    //       {["image"].includes(v.type!) && (
    //         <LabelAndImage
    //           label={v.label}
    //           src={v.defaultValue}
    //           actions={v.uploadImage?.image.actions}
    //           className="aspect-square w-[10rem]"
    //         />
    //       )}
    //     </Fragment>
    //   ))}

    // </GridInput>
  );
};

export default Profile;
