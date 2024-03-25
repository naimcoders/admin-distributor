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
  parseTextToNumber,
} from "src/helpers";
import { IconColor } from "src/types";
import Textarea from "src/components/Textarea";
import { Button } from "src/components/Button";
import { FieldValues, useForm } from "react-hook-form";
import { CurrentProductImageProps } from "./Create";
import { toast } from "react-toastify";
import { useActiveModal } from "src/stores/modalStore";
import { ModalCategory, ModalSubCategory } from "./Modals/Category";
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
import { onPickImage } from "src/helpers/crop-image";
import { Modal } from "src/components/Modal";
import Promotion from "./Modals/Promotion";

const Detail = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [imageUrlDel, setImageUrlDel] = React.useState("");
  const [newImageFile, setNewImageFile] = React.useState<File>();
  const [isMassal, setIsMassal] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState<string[]>([]);
  const [subCategoryId, setSubCategoryId] = React.useState("");

  const variantTypes = useGeneralStore((v) => v.variantTypesDetailProduct);
  const setVariantTypes = useGeneralStore(
    (v) => v.setVariantTypesDetailProduct
  );

  const { id } = useParams() as { id: string };

  const deliveryPrice = useGeneralStore((v) => v.deliveryPrice);
  const setDeliveryPrice = useGeneralStore((v) => v.setDeliveryPrice);
  const priceStore = useGeneralStore((v) => v.price);
  const setPriceStore = useGeneralStore((v) => v.setPrice);
  const navigate = useNavigate();

  const { update, findById, removeImageUrl } = useProduct(id);

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

  const { actionIsDeleteImageProduct, isDeleteImageProduct } = useActiveModal();

  const productImageRef = React.useRef<ChildRef>(null);
  const onOpenExplorer = () => {
    if (productImageRef.current) {
      productImageRef.current.click();
    }
  };

  const {
    remove,
    update: updateVariant,
    removeVariantColor,
    create,
  } = useVariant(id);

  const variantId = useVariantIdStore((v) => v.variantId);
  const clearVariantId = useVariantIdStore((v) => v.clearVariantId);
  const variantColorId = useVariantIdStore((v) => v.variantColorId);
  const clearVariantColorId = useVariantIdStore((v) => v.clearVariantColorId);

  React.useEffect(() => {
    if (findById.data) {
      setCurrentProductImage(
        findById.data.imageUrl?.map((imageUrl) => ({
          name: imageUrl,
          size: "1:1",
          src: imageUrl,
        }))
      );
      setVariantTypes(findById.data.variantProduct);
      setCategoryId(findById.data.categoryProduct.category.id);
      setDeliveryPrice(findById.data.deliveryPrice);
      setPriceStore(findById.data.price);
      setImageUrl(findById.data.imageUrl);
      setVariantTypesPrev(findById.data.variantProduct);

      let price = "";
      if (findById.data.variantProduct.length < 1) {
        price = Currency(findById.data.price.price ?? 0);
      } else {
        const prices: number[] = [];
        const variantColor = findById.data.variantProduct.map(
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

      setSubCategoryId(findById.data.subCategoryProductId);
      setValue("productName", findById.data.name);
      setValue("category", findById.data.categoryProduct.category.name);
      setValue("subCategory", findById.data.subCategoryProduct?.name ?? "-");
      setValue("dangerous", findById.data.isDangerous ? "Ya" : "Tidak");
      setValue(
        "variant",
        findById.data.variantProduct.map((e) => e.name).join(", ")
      );
      setValue("price", price);
      setValue("postage", Currency(findById.data.deliveryPrice.price ?? 0));
      setValue("postage", Currency(findById.data.deliveryPrice.price ?? 0));
      setValue("condition", "Baru");
      setValue("description", findById.data.description);
    }
  }, [findById.data, imageUrl]);

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
        prefix: `product/${id}/${productSize}_${Date.now()}.png`,
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

  const onSubmit = handleSubmit(async (e) => {
    setIsLoading(true);
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
            await updateVariant.mutateAsync({
              data: typePrev,
              variantId: typePrev.id ?? "",
            });
          } catch (e) {
            const error = e as Error;
            console.error(`Failed to update variant : ${error.message}`);
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
        subCategoryId: "",
        imageUrl,
        price: {
          ...priceStore,
          price: newPrice,
        },
      };

      const result = await update.mutateAsync({ data: obj });
      setVariantTypes([]);
      if (result.name) navigate(-1);
    } catch (err) {
      const error = err as Error;
      console.error(`Failed to update : ${error.message}`);
    } finally {
      clearVariantId();
      clearVariantColorId();
      setIsLoading(false);
    }
  });

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;
    const files = e.target.files[0];

    const nFile = await onPickImage({
      file: files,
      ratio: productSize === "1:1" ? 1 / 1 : 3 / 4,
    });

    setNewImageFile(nFile.file);
    if (currentProductImage?.length) {
      setCurrentProductImage([
        ...currentProductImage,
        { src: nFile.url, size: productSize, name: files.name },
      ]);
    } else {
      setCurrentProductImage([
        { src: nFile.url, size: productSize, name: files.name },
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
    actionIsPromotion,
  } = useActiveModal();

  const onClickSubCategory = () => {
    if (!findById.data?.categoryProduct.category.name) {
      toast.error("Pilih kategori");
      return;
    }
    actionIsSubCategory();
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
      defaultValue: Currency(findById.data?.deliveryPrice?.price ?? 0),
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
    objectFields({
      label: "atur promosi",
      name: "promotion",
      type: "modal",
      onClick: actionIsPromotion,
    }),
  ];

  const onIsDeleteModal = (path: string) => {
    setImageUrlDel(path);
    actionIsDeleteImageProduct();
  };

  const onProductSize = (size: string) => {
    setProductSize(size);
    onOpenExplorer();
  };

  const onRemoveImage = async (path: string) => {
    try {
      await removeImageUrl.mutateAsync({
        data: {
          imageUrl: path,
        },
      });
    } catch (err) {
      const error = err as Error;
      console.error(`Failed to remove image : ${error.message}`);
    } finally {
      actionIsDeleteImageProduct();
      setImageUrlDel("");
    }
  };

  return (
    <>
      {findById.error ? (
        <Error error={findById.error.message} />
      ) : findById.isLoading ? (
        <Skeleton />
      ) : (
        <main className="flexcol gap-5 lg:gap-8">
          <header className="flexcol gap-4">
            <section className="flex gap-6 items-start flex-wrap">
              {currentProductImage?.map((v, k) => (
                <Image
                  key={k}
                  src={v.src}
                  alt="Product"
                  className={cx("w-[10rem] object-cover rounded-md")}
                  actions={[
                    {
                      src: <TrashIcon width={16} />,
                      onClick: () => onIsDeleteModal(v.src),
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
                        onClick={() => onProductSize(v)}
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
                            onClick={() => onProductSize(v)}
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

                {["textarea"].includes(v.type!) && (
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
                )}
              </React.Fragment>
            ))}
          </main>

          <Button
            onClick={onSubmit}
            className="mx-auto mt-5"
            aria-label={isLoading ? "loading..." : "simpan"}
          />
        </main>
      )}

      <Modal
        isOpen={isDeleteImageProduct}
        closeModal={actionIsDeleteImageProduct}
      >
        <h2 className="font-semibold text-center">
          Yakin ingin menghapus gambar ini?
        </h2>
        <section className="flex gap-4 lg:mt-8 mt-5">
          <Button
            aria-label="Batal"
            variant="flat"
            className="w-full"
            onClick={actionIsDeleteImageProduct}
          />
          <Button
            aria-label="Hapus"
            className="bg-[#c41414] w-full"
            onClick={() => onRemoveImage(imageUrlDel!)}
          />
        </section>
      </Modal>

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
      <VariantDetailProductModal
        fieldName="variant"
        setValue={setValue}
        productId={id}
      />
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
      <Promotion
        setValue={setValue}
        images={findById.data?.imageUrl ?? []}
        productName={findById.data?.name ?? "-"}
        description={findById.data?.description ?? "-"}
      />
    </>
  );
};

export default Detail;
