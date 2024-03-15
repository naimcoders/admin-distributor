import square from "src/assets/images/square.png";
import rectangle from "src/assets/images/rectangle.png";
import cx from "classnames";
import Error from "src/components/Error";
import Image from "src/components/Image";
import Textarea from "src/components/Textarea";
import PriceModal from "./Modals/Price";
import useGeneralStore from "src/stores/generalStore";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, Fragment, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { ChildRef, File as FileComp } from "src/components/File";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import {
  CurrencyIDInput,
  checkForDash,
  generateRandomString,
  handleErrorMessage,
  parseTextToNumber,
} from "src/helpers";
import { IconColor } from "src/types";
import { useCategory } from "src/api/category.service";
import { useActiveModal } from "src/stores/modalStore";
import {
  Button as Btn,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { Button } from "src/components/Button";
import { DangerousModal } from "./Modals/Dangerous";
import { PostageModal } from "./Modals/Postage";
import { ConditionModal } from "./Modals/Condition";
import { ModalCategory, ModalSubCategory } from "./Modals/Category";
import { VariantModal } from "./Modals/Variant";
import { useAuth } from "src/firebase/auth";
import { ref, uploadBytesResumable } from "firebase/storage";
import { FbStorage } from "src/firebase";
import { useProduct } from "src/api/product.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Create = () => {
  const [isMassal, setIsMassal] = useState(false);

  const {
    reset,
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

  const { fields, categoryId, subCategoryId, setCategoryId, setSubCategoryId } =
    useFields();

  const navigate = useNavigate();
  const findCategories = useCategory().find();
  const { mutateAsync, isPending } = useProduct().create();
  const { user } = useAuth();

  const variantTypes = useGeneralStore((v) => v.variantTypes);
  const setVariantType = useGeneralStore((v) => v.setVariantType);
  const deliveryPrice = useGeneralStore((v) => v.deliveryPrice);
  const clearDeliveryPrice = useGeneralStore((v) => v.clearDeliveryPrice);

  // onSubmit
  const onSubmit = handleSubmit(async (e) => {
    if (photos.length < 1) {
      toast.error("Tambah foto produk");
      return;
    }

    const productUrls: string[] = [];
    await Promise.all(
      photos.map(async (product) => {
        const path = `temp/product/${user?.uid}/${generateRandomString(
          13
        )}.png`;
        const storageRef = ref(FbStorage, path);
        const uploadTask = uploadBytesResumable(storageRef, product.file!);

        new Promise<string>(() => {
          uploadTask.on("state_changed", null, (err) =>
            console.error(err.message)
          );
        });

        productUrls.push(path);
      })
    );

    const variantUrls: { name: string; imageUrl: string }[] = [];
    const availableVariant = Boolean(variantTypes[0]?.imageUrl);
    if (availableVariant) {
      await Promise.all(
        variantTypes.map(async (type) => {
          const path = `temp/product/product_variant/${
            user?.uid
          }/${generateRandomString(13)}.png`;
          const storageRef = ref(FbStorage, path);
          const uploadTask = uploadBytesResumable(storageRef, type.files!);

          new Promise<string>(() => {
            uploadTask.on("state_changed", null, (err) =>
              console.error(err.message)
            );
          });

          variantUrls.push({ name: type.name, imageUrl: path });
        })
      );
    }
    const isDangerous = e.dangerous === "Tidak" ? false : true;

    try {
      const price = e.price as string;
      const newPrice = checkForDash(price) ? 0 : parseTextToNumber(price);
      variantUrls.forEach((url) => {
        const filter = variantTypes.filter((f) => f.name === url.name);
        filter.map((m) => (m.imageUrl = url.imageUrl));
      });

      // const result = await mutateAsync({
      //   data: {
      //     name: e.productName,
      //     isDangerous,
      //     deliveryPrice,
      //     imageUrl: productUrls,
      //     variant: variantTypes,
      //     category: { categoryId },
      //     description: e.description,
      //     price: {
      //       fee: 0,
      //       startAt: 0,
      //       expiredAt: 0,
      //       price: newPrice,
      //       priceDiscount: 0,
      //     },
      //   },
      // });

      console.log({
        name: e.productName,
        isDangerous,
        deliveryPrice,
        imageUrl: productUrls,
        variant: variantTypes,
        category: { categoryId },
        description: e.description,
        price: {
          fee: 0,
          startAt: 0,
          expiredAt: 0,
          price: newPrice,
          priceDiscount: 0,
        },
      });

      // if (result.id) navigate(-1);
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
    } finally {
      setPhotos([]);
      setVariantType([]);
      setCategoryId("");
      setSubCategoryId("");
      clearDeliveryPrice();
      reset();
    }
  });

  return (
    <>
      {findCategories.error ? (
        <Error error={findCategories.error} />
      ) : (
        <main className="flexcol gap-5 lg:gap-8">
          <header className="flexcol gap-4">
            <section className="flex gap-6 items-center flex-wrap">
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
                      <FileComp
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
            </section>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 lg:gap-5">
            {fields.map((v) => (
              <Fragment key={v.label}>
                {["text", "rp"].includes(v.type!) && (
                  <Textfield
                    {...v}
                    control={control}
                    errorMessage={handleErrorMessage(errors, v.name)}
                    readOnly={variantTypes.length > 1 ? v.readOnly : undefined}
                    onClick={variantTypes.length > 1 ? v.onClick : undefined}
                    endContent={
                      variantTypes.length > 1 &&
                      v.name === "price" && (
                        <ChevronRightIcon width={16} color={IconColor.zinc} />
                      )
                    }
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
          </main>

          <main className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
            <Textarea
              label="deskripsi *"
              name="description"
              defaultValue=""
              control={control}
              placeholder="masukkan deskripsi"
              errorMessage={handleErrorMessage(errors, "description")}
              rules={{
                required: { value: true, message: "Masukkan deskripsi" },
              }}
            />
          </main>

          {/* submit */}
          <Button
            onClick={onSubmit}
            className="mx-auto mt-5"
            aria-label={isPending ? "loading..." : "simpan"}
          />

          {/* modal */}
          <ModalCategory
            id={categoryId}
            setValue={setValue}
            setId={setCategoryId}
            clearErrors={clearErrors}
          />
          <ModalSubCategory
            id={subCategoryId}
            setValue={setValue}
            setId={setSubCategoryId}
            clearErrors={clearErrors}
            categoryId={categoryId}
          />
          <DangerousModal setValue={setValue} />
          <ConditionModal setValue={setValue} />
          <PostageModal setValue={setValue} clearErrors={clearErrors} />
          <VariantModal fieldName="variant" setValue={setValue} />
          <PriceModal
            fieldName="price"
            setValue={setValue}
            clearErrors={clearErrors}
            isMassal={isMassal}
            setIsMassal={setIsMassal}
            variantTypes={variantTypes}
          />
        </main>
      )}
    </>
  );
};

export interface CurrentProductImageProps {
  src: string;
  name: String;
  size: string;
  file?: File;
}

export const useUploadProduct = () => {
  const [isPopOver, setIsPopOver] = useState(false);
  const [photos, setPhotos] = useState<CurrentProductImageProps[]>([]);
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

const useFields = () => {
  const {
    actionIsCategory,
    actionIsSubCategory,
    actionIsDangerous,
    actionIsCondition,
    actionIsPostage,
    actionIsVariant,
    actionIsSubDistributor,
    actionIsPrice,
  } = useActiveModal();

  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  const onClickSubCategory = () => {
    if (!categoryId) {
      toast.error("Pilih kategori");
      return;
    }

    actionIsSubCategory();
    console.log(categoryId);
  };

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
      onClick: onClickSubCategory,
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
      onClick: actionIsPrice,
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
  ];

  return {
    fields,
    categoryId,
    setCategoryId,
    subCategoryId,
    setSubCategoryId,
  };
};

export default Create;
