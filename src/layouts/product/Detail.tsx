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
import { useNavigate, useParams } from "react-router-dom";
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
  parseQueryString,
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
import useGeneralStore, {
  VariantTypeProps,
  useVariantIdStore,
} from "src/stores/generalStore";
import PriceModal from "./Modals/Price";
import { VariantDetailProductModal } from "./Modals/VariantDetailProduct";
import { useVariant } from "src/api/variant.service";
import { uploadFile } from "src/firebase/upload";

const Detail = () => {
  const [newImageFile, setNewImageFile] = React.useState<File>();
  const [isMassal, setIsMassal] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState<string[]>([]);
  // const [subCategoryId, setSubCategoryId] = React.useState("");

  const variantTypes = useGeneralStore((v) => v.variantTypesDetailProduct);
  const setVariantTypes = useGeneralStore(
    (v) => v.setVariantTypesDetailProduct
  );

  const { id } = useParams() as { id: string };
  const { isLoading, error, data } = useProduct(id).findById();

  const deliveryPrice = useGeneralStore((v) => v.deliveryPrice);
  const setDeliveryPrice = useGeneralStore((v) => v.setDeliveryPrice);
  const priceStore = useGeneralStore((v) => v.price);
  const setPriceStore = useGeneralStore((v) => v.setPrice);
  const navigate = useNavigate();

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

  const { mutateAsync, isPending } = useProduct(id).update();
  const { remove, update, removeVariantColor, create } = useVariant(id);

  const variantId = useVariantIdStore((v) => v.variantId);
  const clearVariantId = useVariantIdStore((v) => v.clearVariantId);
  const variantColorId = useVariantIdStore((v) => v.variantColorId);
  const clearVariantColorId = useVariantIdStore((v) => v.clearVariantColorId);

  React.useEffect(() => {
    if (data) {
      setCurrentProductImage(
        data.imageUrl?.map((imageUrl) => ({
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

      let price = "";
      if (data.variantProduct.length < 1) {
        price = Currency(data.price.price ?? 0);
      } else {
        const prices: number[] = [];
        const variantColor = data.variantProduct.map(
          (e) => e.variantColorProduct
        );

        variantColor.forEach((e) => {
          e.forEach((m) => {
            prices.push(m.price ?? 0);
          });
        });

        const min = Currency(Math.min(...prices));
        const max = Currency(Math.max(...prices));
        price = min === max ? max : `${min} - ${max}`;
      }

      setValue("productName", data.name);
      setValue("category", data.categoryProduct.category.name);
      setValue("subCategory", data.subCategoryProduct?.name ?? "-");
      setValue("dangerous", data.isDangerous ? "Ya" : "Tidak");
      setValue("variant", data.variantProduct.map((e) => e.name).join(", "));
      setValue("price", price);
      setValue("postage", Currency(data.deliveryPrice.price ?? 0));
      setValue("postage", Currency(data.deliveryPrice.price ?? 0));
      setValue("condition", "Baru");
      setValue("description", data.description);
    }
  }, [data, imageUrl]);

  React.useEffect(() => {
    if (newImageFile) onUploadImage();
  }, [newImageFile]);

  const onUploadImage = async () => {
    try {
      if (!newImageFile) return;
      toast.loading("sedang upload foto produk", {
        toastId: "upload-foto-produk",
      });
      await uploadFile({
        file: newImageFile,
        prefix: `product/${id}/${Date.now()}.png`,
      });
      toast.success(`Berhasil upload foto produk`);
    } catch (e) {
      const err = e as Error;
      console.log(`Error upload product ` + `${err.message}`);
      toast.error(`Gagal upload foto produk`);
    } finally {
      toast.dismiss("upload-foto-produk");
      setNewImageFile(undefined);
    }
  };

  const parsed = parseQueryString<{ page: string }>();

  const onSubmit = handleSubmit(async (e) => {
    // ON CREATE VARIANT
    if (variantTypesPrev.length < variantTypes.length) {
      variantTypes.forEach(async (type) => {
        const typePrevByName = variantTypesPrev.map((prev) => prev.name);
        if (!typePrevByName.includes(type.name)) {
          try {
            const newVariant = await create.mutateAsync({
              data: {
                productId: id,
                name: type.name,
                imageUrl: "",
                variantColorProduct: type.variantColorProduct,
              },
            });

            if (!type.files) return;
            await uploadFile({
              file: type.files,
              prefix: `product_variant/${newVariant.id}/${Date.now()}.png`,
            });
          } catch (err) {
            const error = err as Error;
            console.error(
              `Something wrong to create a new variant : ${error.message}`
            );
          }
        }
      });
    }

    // ON REMOVE VARIANT
    if (variantId.length) {
      variantId.forEach(async (id) => {
        try {
          await remove.mutateAsync({ variantId: id });
        } catch (e) {
          const error = e as Error;
          console.error(
            `Something wrong to remove variant color : ${error.message}`
          );
        }
      });
    }

    // ON REMOVE VARIANT COLOR
    if (variantColorId.length) {
      variantColorId.forEach(async (id) => {
        try {
          await removeVariantColor.mutateAsync({ variantColorId: id });
        } catch (e) {
          const error = e as Error;
          console.error(
            `Something wrong to remove variant color : ${error.message}`
          );
        }
      });
    }

    // ON UPDATE VARIANT CURRENT VARIANTS
    variantTypesPrev.forEach((typePrev) => {
      variantTypes.map(async (type) => {
        if (typePrev.name === type.name) {
          try {
            await update.mutateAsync({
              data: typePrev,
              variantId: typePrev.id ?? "",
            });
          } catch (e) {
            const error = e as Error;
            console.error(
              `Something wrong to update variant : ${error.message}`
            );
          }
        }
      });
    });

    try {
      const isDangerous = e.dangerous === "Tidak" ? false : true;
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

      const result = await mutateAsync({
        data: obj,
        limit: 10,
        page: Number(parsed.page),
        search: "",
      });
      setVariantTypes([]);
      if (result.name) navigate(-1);
    } catch (err) {
      const error = err as Error;
      console.error(`Something wrong to update : ${error.message}`);
    } finally {
      clearVariantId();
      clearVariantColorId();
    }
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;
    const files = e.target.files[0];
    setNewImageFile(files);
    const blob = URL.createObjectURL(files);

    if (currentProductImage?.length) {
      setCurrentProductImage([
        ...currentProductImage,
        { src: blob, size: productSize, name: files.name },
      ]);
    } else {
      setCurrentProductImage([
        { src: blob, size: productSize, name: files.name },
      ]);
    }
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
              {currentProductImage?.map((v, k) => (
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
                      variantTypes.length &&
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
