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
import { CurrencyIDInput, getFileType, handleErrorMessage } from "src/helpers";
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
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FbStorage } from "src/firebase";
import { useProduct } from "src/api/product.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

  const {
    fields,
    categoryId,
    subCategoryId,
    setCategoryId,
    setSubCategoryId,
    onClickSubCategory,
  } = useFields();

  const navigate = useNavigate();
  const findCategories = useCategory().find();
  const { mutateAsync, isPending } = useProduct().create();
  const { user } = useAuth();

  const variantTypes = useGeneralStore((v) => v.variantTypes);
  const deliveryPrice = useGeneralStore((v) => v.deliveryPrice);

  // onSubmit
  const onSubmit = handleSubmit(async (e) => {
    if (photos.length < 1) {
      toast.error("Tambah foto produk");
      return;
    }

    const productUrls: string[] = [];
    const variantUrls: string[] = [];

    await Promise.all(
      photos.map(async (product) => {
        const fileType = getFileType(product.file.type);
        const fileName = `${product.file.lastModified}.${fileType}`;
        const fileNameFix = `temp/product/${user?.uid}/${fileName}`;
        const storageRef = ref(FbStorage, fileNameFix);
        const uploadTask = uploadBytesResumable(storageRef, product.file);

        const promise = new Promise<string>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (err) => {
              console.error(err.message);
              reject(err);
            },
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });

        productUrls.push(await promise);
      })
    );

    const availableVariant = Boolean(variantTypes[0].imageUrl);
    if (availableVariant) {
      await Promise.all(
        variantTypes.map(async (type) => {
          const fileType = getFileType(type.files?.type ?? "");
          const fileName = `${type.files?.lastModified}.${fileType}`;
          const fileNameFix = `temp/product/product_variant/${user?.uid}/${fileName}`;
          const storageRef = ref(FbStorage, fileNameFix);
          const uploadTask = uploadBytesResumable(storageRef, type.files!);

          const promise = new Promise<string>((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              null,
              (err) => {
                console.error(err.message);
                reject(err);
              },
              async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
              }
            );
          });

          variantUrls.push(await promise);
          return promise;
        })
      );

      variantTypes.map((m, k) => {
        m.imageUrl = variantUrls[k];
      });
    }

    const isDangerous = e.dangerous === "Tidak" ? false : true;

    try {
      const price = e.price;
      const name = e.productName;

      console.log({
        price,
        variantTypes,
      });

      // mutateAsync({
      //   data: {
      //     name,
      //     isDangerous,
      //     deliveryPrice,
      //     imageUrl: productUrls,
      //     variant: variantTypes,
      //     category: { categoryId },
      //     description: e.description,
      //     price: {
      //       price,
      //       fee: 0,
      //       startAt: 0,
      //       expiredAt: 0,
      //       priceDiscount: 0,
      //     },
      //   },
      // });
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
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
                {["text", "rp", "number"].includes(v.type!) && (
                  <Textfield
                    {...v}
                    type={v.type}
                    control={control}
                    errorMessage={handleErrorMessage(errors, v.name)}
                    readOnly={variantTypes.length > 1 ? v.readOnly : undefined}
                    onClick={variantTypes.length > 1 ? v.onClick : undefined}
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
              label="deskripsi"
              name="description"
              defaultValue=""
              control={control}
              placeholder="masukkan deskripsi"
            />
          </main>

          {/* submit */}
          <Button
            aria-label={isPending ? "loading..." : "simpan"}
            className="mx-auto mt-5"
            onClick={onSubmit}
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
          />
        </main>
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
    objectFields({
      label: "deskripsi produk",
      name: "description",
      type: "textarea",
      defaultValue: "",
    }),
  ];

  return {
    fields,
    categoryId,
    setCategoryId,
    subCategoryId,
    setSubCategoryId,
    onClickSubCategory,
  };
};

export default Create;
