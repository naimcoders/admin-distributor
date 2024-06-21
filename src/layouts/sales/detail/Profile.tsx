import {
  HiOutlineArrowUpTray,
  HiOutlineChevronRight,
  HiOutlineTrash,
} from "react-icons/hi2";
import React from "react";
import { useForm } from "react-hook-form";
import { Textfield } from "src/components/Textfield";
import { OptionCategoryModal, useKtp } from "../Create";
import { File, LabelAndImage } from "src/components/File";
import {
  handleErrorMessage,
  parsePhoneNumber,
  setRequiredField,
} from "src/helpers";
import { IconColor } from "src/types";
import {
  TUpdateSales,
  findSalesById,
  updateSales,
  updateSalesCategory,
} from "src/api/sales.service";
import { useParams } from "react-router-dom";
import Error from "src/components/Error";
import Skeleton from "src/components/Skeleton";
import { getFileFromFirebase, uploadFile } from "src/firebase/upload";
import { findCategories } from "src/api/category.service";
import { toast } from "react-toastify";
import { Button } from "src/components/Button";

interface IDefaultValues {
  comition: string;
  name: string;
  phoneNumber: string;
  email: string;
  category: string;
  ktpPathImage: string;
}

const Profile = () => {
  const [isCategoryModal, setIsCategoryModal] = React.useState(false);
  const [pickCategories, setPickCategories] = React.useState<string[]>([]);

  const {
    control,
    clearErrors,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<IDefaultValues>();
  const { id } = useParams() as { id: string };

  const {
    ktpBlob,
    ktpRef,
    onClick,
    onChange,
    setKtpBlob,
    ktpFiles,
    setKtpFiles,
  } = useKtp();

  const onCloseCategoryModal = () => setIsCategoryModal((v) => !v);

  const salesById = findSalesById(id);
  const findAllCategories = findCategories();
  const updateCategory = updateSalesCategory();
  const update = updateSales();

  React.useEffect(() => {
    if (salesById.data) {
      setKtpBlob(salesById.data.ktpImage);
      getFileFromFirebase(salesById.data.ktpImage).then((path) =>
        setKtpBlob(path ?? "")
      );
      setPickCategories(salesById.data.category.map((e) => e.id));
      setValue("ktpPathImage", salesById.data.ktpImage);
    }
  }, [salesById.data]);

  const onNext = async () => {
    try {
      toast.loading("Loading...", { toastId: "loading-update-sales-category" });
      await updateCategory.mutateAsync({
        salesId: id,
        categoryId: pickCategories,
      });
      toast.success("Berhasil memperbarui kategori");
      clearErrors("category");
      onCloseCategoryModal();
    } catch (e) {
      const error = e as Error;
      toast.error("Gagal memperbarui kategori");
      console.error(error.message);
    } finally {
      toast.dismiss("loading-update-sales-category");
    }
  };

  const updated = async (request: TUpdateSales) => {
    try {
      await update.mutateAsync({
        salesId: id,
        data: request,
      });
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
    }
  };

  const onUpdateSales = handleSubmit(async (e) => {
    try {
      toast.loading("Loading...", { toastId: "loading-update-sales" });
      const fileName = `temp/sales/${Date.now()}.png`;

      let data = {
        comition: Number(e.comition),
        email: e.email,
        name: e.name,
        phoneNumber: parsePhoneNumber(e.phoneNumber),
      };

      if (ktpFiles) {
        await uploadFile({ file: ktpFiles, prefix: fileName });
        Object.assign(data, { ktpPathImage: fileName });
        await updated(data);
      } else await updated(data);

      setKtpFiles(undefined);
      toast.success("Berhasil menyimpan data");
    } catch (e) {
      toast.error("Gagal menyimpan data");
    } finally {
      toast.dismiss("loading-update-sales");
    }
  });

  return (
    <main>
      {salesById.error && <Error error={salesById.error.message} />}
      {salesById.isLoading ? (
        <Skeleton />
      ) : (
        <>
          <section className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-2 lg:gap-8 gap-4 mt-5">
            <Textfield
              type="text"
              label="nama sales"
              control={control}
              name="name"
              placeholder="Masukkan nama sales"
              defaultValue={salesById.data?.name}
              errorMessage={handleErrorMessage(errors, "name")}
              rules={{
                required: setRequiredField(true, "Masukkan nama sales"),
              }}
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
              onClick={onCloseCategoryModal}
              endContent={<HiOutlineChevronRight size={16} />}
            />

            <Textfield
              label="komisi penjualan (%)"
              control={control}
              name="comition"
              placeholder="masukkan komisi"
              defaultValue={String(salesById.data?.comition)}
              errorMessage={handleErrorMessage(errors, "comition")}
              rules={{ required: setRequiredField(true, "masukkan komisi") }}
              className="w-full"
            />

            {!ktpBlob ? (
              <File
                name="ktpPathImage"
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
                    onClick: () => {
                      setKtpBlob("");
                      setValue("ktpPathImage", "");
                    },
                  },
                ]}
              />
            )}

            <LabelAndImage
              src={salesById.data?.imageUrl ?? ""}
              label="foto sales"
            />
          </section>
          <Button
            label="simpan"
            className="block mx-auto lg:mt-28 mt-10"
            onClick={onUpdateSales}
          />
        </>
      )}

      <OptionCategoryModal
        value={pickCategories}
        setCategories={setPickCategories}
        data={findAllCategories.data ?? []}
        isOpenModal={isCategoryModal}
        onCloseModal={onCloseCategoryModal}
        onNext={onNext}
        defaultValue={salesById.data?.category.map((e) => e.id)}
      />
    </main>
  );
};

export default Profile;
