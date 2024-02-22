import square from "src/assets/images/square.png";
import rectangle from "src/assets/images/rectangle.png";
import cx from "classnames";
import Error from "src/components/Error";
import Image from "src/components/Image";
import Textarea from "src/components/Textarea";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, Fragment, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { ChildRef, File } from "src/components/File";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { CurrencyIDInput, getFileType, handleErrorMessage } from "src/helpers";
import { IconColor } from "src/types";
import { GridInput, WrapperInput } from "../Index";
import { useCategory } from "src/api/category.service";
import { useActiveModal } from "src/stores/modalStore";
import {
  Button as Btn,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { Button } from "src/components/Button";
import useGeneralStore from "src/stores/generalStore";
import { DangerousModal } from "./Modals/Dangerous";
import { PostageModal } from "./Modals/Postage";
import { ConditionModal } from "./Modals/Condition";
import { ModalCategory } from "./Modals/Category";
import { VariantModal } from "./Modals/Variant";
import { useAuth } from "src/firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FbStorage } from "src/firebase";
import PriceModal from "./Modals/Price";

const Create = () => {
  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();

  const {
    productPhotoRef,
    onClick,
    onChange,
    photos,
    setPhotos,
    handleProductSize,
    isPopOver,
    setIsPopOver,
  } = useUploadProduct();

  const [categoryId, setCategoryId] = useState("");
  const deliveryPrice = useGeneralStore((v) => v.deliveryPrice);

  const findAllCategories = useCategory().findAll();
  const { fields } = useFields();

  const { user } = useAuth();
  const variantTypes = useGeneralStore((v) => v.variantTypes);

  const onSubmit = handleSubmit(async (e) => {
    const productUrl: string[] = [];

    photos.forEach((product) => {
      const fileType = getFileType(product.file.type);
      const fileName = `${product.file.lastModified}.${fileType}`;
      const fileNameFix = `temp/product/${user?.uid}/${fileName}`;
      const storageRef = ref(FbStorage, fileNameFix);
      const uploadTask = uploadBytesResumable(storageRef, product.file);

      uploadTask.on(
        "state_changed",
        null,
        (err) => console.error(err.message),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          productUrl.push(url);
        }
      );
    });

    const isDangerous = e.dangerous === "Tidak" ? false : true;

    try {
      const obj = {
        category: { categoryId },
        deliveryPrice,
        description: e.description,
        isDangerous,
        name: e.productName,
        imageUrl: productUrl,
        variant: variantTypes,
      };

      console.log(obj);
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
    }
  });

  return (
    <>
      {findAllCategories.error ? (
        <Error error={findAllCategories.error} />
      ) : (
        <WrapperInput>
          <header className="flex gap-6 items-center flex-wrap">
            {photos.map((v) => (
              <Image
                src={v.src}
                alt="Product"
                key={v.src}
                className={cx(
                  "w-[10rem] object-cover rounded-md",
                  v.size === "1:1" ? "aspect-square" : "aspect-3/4"
                )}
                actions={[
                  {
                    src: <TrashIcon width={16} />,
                    onClick: () => setPhotos(photos.filter((e) => e !== v)),
                  },
                ]}
              />
            ))}

            <Popover placement="right" isOpen={isPopOver}>
              <PopoverTrigger>
                <Btn onClick={() => setIsPopOver((v) => !v)} color="primary">
                  Tambah Foto
                </Btn>
              </PopoverTrigger>
              <PopoverContent>
                <section className="flex gap-4">
                  {["1:1", "3:4"].map((v) => (
                    <File
                      key={v}
                      control={control}
                      onClick={() => {
                        handleProductSize(v);
                        onClick();
                      }}
                      onChange={onChange}
                      name="productPhoto"
                      ref={productPhotoRef}
                      placeholder={v}
                      className="w-[5rem] cursor-pointer"
                      readOnly={{ isValue: true, cursor: "cursor-pointer" }}
                      startContent={
                        <img
                          src={v === "1:1" ? square : rectangle}
                          alt="square icon"
                          className="w-4 cursor-pointer"
                        />
                      }
                    />
                  ))}
                </section>
              </PopoverContent>
            </Popover>
          </header>

          <GridInput className="grid grid-cols-3">
            {fields.map((v) => (
              <Fragment key={v.label}>
                {["text", "rp", "number"].includes(v.type!) && (
                  <Textfield
                    {...v}
                    type={v.type}
                    control={control}
                    errorMessage={handleErrorMessage(errors, v.name)}
                    readOnly={variantTypes.length > 1 ? v.readOnly : undefined}
                    rules={{
                      required: v.rules?.required,
                      onBlur:
                        variantTypes.length < 1
                          ? (e) =>
                              CurrencyIDInput({
                                type: v.type!,
                                fieldName: v.name,
                                setValue,
                                value: e.target.value,
                              })
                          : undefined,
                    }}
                  />
                )}

                {["modal"].includes(v.type!) && (
                  <Textfield
                    {...v}
                    control={control}
                    errorMessage={handleErrorMessage(errors, v.name)}
                    readOnly={{ isValue: true, cursor: "cursor-pointer" }}
                    endContent={
                      <ChevronRightIcon width={16} color={IconColor.zinc} />
                    }
                  />
                )}
              </Fragment>
            ))}
          </GridInput>

          <GridInput className="grid grid-cols-3">
            <Textarea
              label="deskripsi"
              name="description"
              defaultValue=""
              control={control}
              placeholder="masukkan deskripsi"
            />
          </GridInput>

          {/* submit */}
          <Button
            aria-label="simpan"
            className="mx-auto mt-5"
            onClick={onSubmit}
          />

          {/* modal */}
          <ModalCategory
            setCategoryId={setCategoryId}
            setValue={setValue}
            clearErrors={clearErrors}
          />
          <DangerousModal setValue={setValue} />
          <ConditionModal setValue={setValue} />
          <PostageModal setValue={setValue} clearErrors={clearErrors} />
          <VariantModal fieldName="variant" setValue={setValue} />
          <PriceModal
            fieldName="price"
            setValue={setValue}
            clearErrors={clearErrors}
          />
          {/* <ModalSubDistributor setValue={setValue} clearErrors={clearErrors} /> */}
        </WrapperInput>
      )}
    </>
  );
};

export const useUploadProduct = () => {
  const [isPopOver, setIsPopOver] = useState(false);
  const [photos, setPhotos] = useState<
    { src: string; name: String; size: string; file: File }[]
  >([]);
  const [productSize, setProductSize] = useState("1:1");
  const productPhotoRef = useRef<ChildRef>(null);

  const handleProductSize = (size: string) => setProductSize(size);

  const onClick = () => {
    if (productPhotoRef.current) {
      productPhotoRef.current.click();
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;

    const files = e.target.files[0];
    const blob = URL.createObjectURL(files);
    setPhotos([
      ...photos,
      { src: blob, size: productSize, name: files.name, file: files },
    ]);
    setIsPopOver((v) => !v);
  };

  return {
    productPhotoRef,
    onClick,
    onChange,
    photos,
    setPhotos,
    handleProductSize,
    isPopOver,
    setIsPopOver,
  };
};

// const ModalSubDistributor = ({
//   clearErrors,
//   setValue,
// }: Pick<UseForm, "setValue" | "clearErrors">) => {
//   const { actionIsSubDistributor, isSubDistributor } = useActiveModal();
//   const subDistributors: string[] = [
//     "Agung Jaya",
//     "Bintang",
//     "Arta Boga Cemerlang",
//     "Semeru",
//     "Ektong",
//     "Bintang Terang",
//   ];

//   return (
//     <ListingModal
//       title="sub-distributor"
//       keyField="subDistributor"
//       data={[]}
//       setValue={setValue}
//       clearErrors={clearErrors}
//       modal={{
//         open: isSubDistributor,
//         close: actionIsSubDistributor,
//       }}
//     />
//   );
// };

const useFields = () => {
  const {
    actionIsCategory,
    actionIsSubCategory,
    actionIsDangerous,
    actionIsCondition,
    actionIsPostage,
    actionIsVariant,
    actionIsSubDistributor,
  } = useActiveModal();

  const fields: TextfieldProps[] = [
    objectFields({
      label: "nama produk *",
      name: "productName",
      type: "text",
      defaultValue: "",
      rules: { required: { value: true, message: "Masukkan nama produk" } },
    }),
    objectFields({
      label: "kategori *",
      name: "category",
      type: "modal",
      defaultValue: "",
      onClick: actionIsCategory,
      rules: { required: { value: true, message: "Pilih kategori" } },
    }),
    objectFields({
      label: "sub-kategori",
      name: "subCategory",
      type: "modal",
      defaultValue: "",
      onClick: actionIsSubCategory,
    }),
    objectFields({
      label: "produk berbahaya",
      name: "dangerous",
      type: "modal",
      defaultValue: "Tidak",
      onClick: actionIsDangerous,
    }),
    objectFields({
      label: "variasi",
      name: "variant",
      type: "modal",
      defaultValue: "",
      placeholder: "tentukan variasi",
      onClick: actionIsVariant,
    }),
    objectFields({
      label: "harga (Rp) *",
      name: "price",
      type: "rp",
      placeholder: "masukkan harga",
      defaultValue: "",
      rules: { required: { value: true, message: "masukkan harga" } },
      readOnly: { isValue: true, cursor: "cursor-pointer" },
    }),
    objectFields({
      label: "ongkos kirim (berat/ukuran) *",
      name: "postage",
      type: "modal",
      defaultValue: "",
      placeholder: "masukkan ongkos kirim",
      onClick: actionIsPostage,
      rules: { required: { value: true, message: "atur ongkos kirim" } },
    }),
    objectFields({
      label: "kondisi *",
      name: "condition",
      type: "modal",
      defaultValue: "Baru",
      onClick: actionIsCondition,
      rules: { required: { value: true, message: "pilih kondisi" } },
    }),
    objectFields({
      label: "sub-distributor",
      name: "subDistributor",
      type: "modal",
      defaultValue: "",
      onClick: actionIsSubDistributor,
    }),
    objectFields({
      label: "deskripsi produk",
      name: "description",
      type: "textarea",
      defaultValue: "",
    }),
  ];

  return { fields };
};

export default Create;
