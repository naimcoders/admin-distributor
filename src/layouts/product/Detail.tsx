import React from "react";
import cx from "classnames";
import { ChevronRightIcon, TrashIcon } from "@heroicons/react/24/outline";
import square from "src/assets/images/square.png";
import rectangle from "src/assets/images/rectangle.png";
import {
  Popover,
  PopoverTrigger,
  Button as Btn,
  PopoverContent,
} from "@nextui-org/react";
import { useParams } from "react-router-dom";
import { useProduct } from "src/api/product.service";
import Error from "src/components/Error";
import Image from "src/components/Image";
import Skeleton from "src/components/Skeleton";
import { ChildRef, File as FileComp } from "src/components/File";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import {
  Currency,
  CurrencyIDInput,
  checkForDash,
  handleErrorMessage,
  parseTextToNumber,
} from "src/helpers";
import { IconColor } from "src/types";
import Textarea from "src/components/Textarea";
import { Button } from "src/components/Button";
import { FieldValues, useForm } from "react-hook-form";
import { CurrentProductImageProps } from "./Create";
import { toast } from "react-toastify";
import { useActiveModal } from "src/stores/modalStore";
import { ModalCategory } from "./Modals/Category";
import { DangerousModal } from "./Modals/Dangerous";
import { ConditionModal } from "./Modals/Condition";
import { PostageModal } from "./Modals/Postage";
import useGeneralStore, { VariantTypeProps } from "src/stores/generalStore";
import PriceModal from "./Modals/Price";
import { VariantDetailProductModal } from "./Modals/VariantDetailProduct";
import { ref, uploadBytesResumable } from "firebase/storage";
import { FbStorage } from "src/firebase";
import { useVariant } from "src/api/variant.service";
import { useAuth } from "src/firebase/auth";

const Detail = () => {
  const [isMassal, setIsMassal] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState<string[]>([]);
  // const [subCategoryId, setSubCategoryId] = React.useState("");

  const variantTypes = useGeneralStore((v) => v.variantTypesDetailProduct);
  const setVariantTypes = useGeneralStore(
    (v) => v.setVariantTypesDetailProduct
  );

  const { id } = useParams() as { id: string };
  const { isLoading, error, data } = useProduct().findById(id);

  const deliveryPrice = useGeneralStore((v) => v.deliveryPrice);
  const setDeliveryPrice = useGeneralStore((v) => v.setDeliveryPrice);
  const priceStore = useGeneralStore((v) => v.price);
  const setPriceStore = useGeneralStore((v) => v.setPrice);

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();

  const [isPopOver, setIsPopOver] = React.useState(false);
  const [productSize, setProductSize] = React.useState("1:1");
  const [currentProductImage, setCurrentProductImage] = React.useState<
    CurrentProductImageProps[]
  >([]);
  const [variantTypesPrev, setVariantTypesPrev] = React.useState<
    VariantTypeProps[]
  >([]);

  const productImageRef = React.useRef<ChildRef>(null);
  const onOpenExplorer = () => {
    if (productImageRef.current) {
      productImageRef.current.click();
    }
  };

  const { mutateAsync, isPending } = useProduct().update(id);

  const { remove, update, removeVariantColor, create } = useVariant();
  const updateVariant = update(id);
  const removeVariant = remove(id);
  const removeVarColor = removeVariantColor(id);
  const createVariant = create(id);
  const { user } = useAuth();

  const generalId = useGeneralStore((v) => v.generalId);
  const clearGeneralId = useGeneralStore((v) => v.clearGeneralId);

  const onSubmit = handleSubmit(async (e) => {
    const isDangerous = e.dangerous === "Tidak" ? false : true;

    if (imageUrl.length !== currentProductImage.length) {
      await Promise.all(
        currentProductImage.map(async (product) => {
          const path = `product/${id}/${Date.now()}.png`;
          const storageRef = ref(FbStorage, path);
          const uploadTask = uploadBytesResumable(storageRef, product.file!);
          new Promise<string>(() => {
            uploadTask.on("state_changed", null, (err) => {
              console.error(err.message);
            });
          });
        })
      );
    }

    // create variant
    const variantUrls: { name: string; imageUrl: string }[] = [];
    if (variantTypes.length > variantTypesPrev.length) {
      variantTypes.forEach(async (type) => {
        const typeByName = variantTypesPrev.map((typePrev) => typePrev.name);

        if (!typeByName.includes(type.name)) {
          await Promise.all(
            variantTypes.map(async (type) => {
              const path = `temp/product/product_variant/${
                user?.uid
              }/${Date.now()}.png`;
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

          variantUrls.forEach((url) => {
            const [typeByName] = variantTypes.filter(
              (f) => f.name === url.name
            );
            typeByName.imageUrl = url.imageUrl;
          });

          await createVariant.mutateAsync({
            data: {
              name: type.name,
              variantColorProduct: type.variantColorProduct,
              imageUrl: type.imageUrl,
              productId: id,
            },
          });
        }
      });
    }

    if (generalId.length) {
      generalId.forEach(async (e) => {
        try {
          await removeVarColor.mutateAsync({ variantColorId: e });
        } catch (e) {
          const error = e as Error;
          console.error(
            `Something wrong to remove variant color : ${error.message}`
          );
        }
      });
    }

    try {
      const price = e.price;
      const newPrice = checkForDash(price) ? 0 : parseTextToNumber(price);
      const obj = {
        name: e.productName,
        isDangerous,
        deliveryPrice,
        category: { categoryId },
        description: e.description,
        imageUrl,
        price: {
          ...priceStore,
          price: newPrice,
        },
      };

      await mutateAsync({ data: obj });
    } catch (e) {
      const error = e as Error;
      console.error(error.message);
    } finally {
      clearGeneralId();
    }
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;
    const files = e.target.files[0];
    const blob = URL.createObjectURL(files);
    setCurrentProductImage([
      ...currentProductImage,
      { src: blob, size: productSize, name: files.name, file: files },
    ]);
    setIsPopOver((v) => !v);
  };

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

  const onClickSubCategory = () => {
    if (!data?.categoryProduct.category.name) {
      toast.error("Pilih kategori");
      return;
    }
    actionIsSubCategory();
    console.log(data?.categoryProduct.category.name);
  };

  React.useEffect(() => {
    if (data) {
      setCurrentProductImage(
        data.imageUrl.map((imageUrl) => ({
          name: imageUrl,
          size: "1:1",
          src: imageUrl,
        }))
      );
      setVariantTypes(data.variantProduct);
      setCategoryId(data.categoryProduct.category.id);
      setDeliveryPrice(data.deliveryPrice);
      setPriceStore(data.price);
      setImageUrl(data.imageUrl);
      setVariantTypesPrev(data.variantProduct);

      setValue("productName", data.name);
      setValue("category", data.categoryProduct.category.name);
      setValue("subCategory", data.subCategoryProduct?.name ?? "-");
      setValue("dangerous", data.isDangerous ? "Ya" : "Tidak");
      setValue("variant", data.variantProduct.map((e) => e.name).join(", "));
      setValue("price", Currency(data.price.price ?? 0));
      setValue("postage", Currency(data.deliveryPrice.price ?? 0));
      setValue("postage", Currency(data.deliveryPrice.price ?? 0));
      setValue("condition", "Baru");
      setValue("description", data.description);
    }
  }, [data, imageUrl]);

  const fields: TextfieldProps[] = [
    objectFields({
      label: "nama produk *",
      name: "productName",
      type: "text",
      rules: { required: { value: true, message: "Masukkan nama produk" } },
    }),
    objectFields({
      label: "kategori *",
      name: "category",
      type: "modal",
      onClick: actionIsCategory,
      rules: { required: { value: true, message: "Pilih kategori" } },
    }),
    objectFields({
      label: "sub-kategori",
      name: "subCategory",
      type: "modal",
      onClick: onClickSubCategory,
    }),
    objectFields({
      label: "produk berbahaya",
      name: "dangerous",
      type: "modal",
      onClick: actionIsDangerous,
    }),
    objectFields({
      label: "variasi",
      name: "variant",
      type: "modal",
      placeholder: "tentukan variasi",
      onClick: actionIsVariant,
    }),
    objectFields({
      label: "harga (Rp) *",
      name: "price",
      type: "rp",
      placeholder: "masukkan harga",
      rules: { required: { value: true, message: "masukkan harga" } },
      readOnly: { isValue: true, cursor: "cursor-pointer" },
      onClick: actionIsPrice,
    }),
    objectFields({
      label: "ongkos kirim (berat/ukuran) *",
      name: "postage",
      type: "modal",
      defaultValue: Currency(data?.deliveryPrice?.price ?? 0),
      placeholder: "masukkan ongkos kirim",
      onClick: actionIsPostage,
      rules: { required: { value: true, message: "atur ongkos kirim" } },
    }),
    objectFields({
      label: "kondisi *",
      name: "condition",
      type: "modal",
      onClick: actionIsCondition,
      rules: { required: { value: true, message: "pilih kondisi" } },
    }),
    objectFields({
      label: "sub-distributor",
      name: "subDistributor",
      type: "modal",
      onClick: actionIsSubDistributor,
    }),
    objectFields({
      label: "deskripsi *",
      name: "description",
      type: "textarea",
    }),
  ];

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : isLoading ? (
        <Skeleton />
      ) : (
        <main className="flexcol gap-5 lg:gap-8">
          <header className="flexcol gap-4">
            <section className="flex gap-6 items-center flex-wrap">
              {currentProductImage.map((v, k) => (
                <Image
                  key={k}
                  src={v.src}
                  alt="Product"
                  className={cx(
                    "w-[10rem] object-cover rounded-md",
                    v.size === "1:1" ? "aspect-square" : "aspect-3/4"
                  )}
                  actions={[
                    {
                      src: <TrashIcon width={16} />,
                      onClick: () =>
                        setCurrentProductImage(
                          currentProductImage.filter((e) => e !== v)
                        ),
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
                          setProductSize(v);
                          onOpenExplorer();
                        }}
                        onChange={onChange}
                        name="productPhoto"
                        ref={productImageRef}
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
              <React.Fragment key={v.label}>
                {["text", "rp"].includes(v.type!) && (
                  <Textfield
                    {...v}
                    control={control}
                    errorMessage={handleErrorMessage(errors, v.name)}
                    readOnly={variantTypes.length > 0 ? v.readOnly : undefined}
                    onClick={variantTypes.length > 0 ? v.onClick : undefined}
                    defaultValue=""
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
                    defaultValue=""
                    endContent={
                      <ChevronRightIcon width={16} color={IconColor.zinc} />
                    }
                  />
                )}
              </React.Fragment>
            ))}
          </main>

          <main className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
            {fields.map(
              (v) =>
                ["textarea"].includes(v.type!) && (
                  <Textarea
                    {...v}
                    key={v.label}
                    control={control}
                    defaultValue=""
                    classNameWrapper="col-span-2"
                    errorMessage={handleErrorMessage(errors, v.name)}
                    rules={{
                      required: { value: true, message: v.errorMessage! },
                    }}
                  />
                )
            )}
          </main>

          <Button
            onClick={onSubmit}
            className="mx-auto mt-5"
            aria-label={isPending ? "loading..." : "simpan"}
          />
        </main>
      )}

      <ModalCategory
        id={categoryId}
        setValue={setValue}
        setId={setCategoryId}
        clearErrors={clearErrors}
      />
      <DangerousModal setValue={setValue} />
      <ConditionModal setValue={setValue} />
      <VariantDetailProductModal fieldName="variant" setValue={setValue} />
      <PostageModal
        setValue={setValue}
        clearErrors={clearErrors}
        data={deliveryPrice}
      />
      <PriceModal
        fieldName="price"
        setValue={setValue}
        clearErrors={clearErrors}
        isMassal={isMassal}
        setIsMassal={setIsMassal}
        variantTypes={variantTypes}
      />
    </>
  );
};

export default Detail;
