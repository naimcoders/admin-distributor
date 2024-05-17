import React from "react";
import cx from "classnames";
import {
  HiOutlineChevronRight,
  HiOutlineTrash,
  HiOutlineXMark,
} from "react-icons/hi2";
import square from "src/assets/images/square.png";
import rectangle from "src/assets/images/rectangle.png";
import {
  Popover,
  PopoverTrigger,
  Button as Btn,
  PopoverContent,
  Spinner,
} from "@nextui-org/react";
import { useParams } from "react-router-dom";
import { removeImageProduct, useProduct } from "src/api/product.service";
import Error from "src/components/Error";
import Image from "src/components/Image";
import Skeleton from "src/components/Skeleton";
import { ChildRef, File as FileComp, ImageFile } from "src/components/File";
import { Textfield } from "src/components/Textfield";
import {
  Currency,
  CurrencyIDInput,
  epochToDateConvert,
  handleErrorMessage,
  parseTextToNumber,
  setRequiredField,
} from "src/helpers";
import { IconColor } from "src/types";
import Textarea from "src/components/Textarea";
import { Button } from "src/components/Button";
import { FieldValues, useForm } from "react-hook-form";
import { CurrentProductImageProps } from "./Create";
import { toast } from "react-toastify";
import { useActiveModal } from "src/stores/modalStore";
import { ListingModal } from "./Modals/Category";
// import { DangerousModal } from "./Modals/Dangerous";
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
import { SubDistributorModal } from "./Modals/SubDistributor";
import { setUser } from "src/stores/auth";
import { RoleDistributor } from "src/api/distributor.service";
import { findCategories } from "src/api/category.service";
import { findSubCategoryByCategoryId } from "src/api/product-category.service";

const Detail = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isCourierInternal, setIsCourierInternal] = React.useState(true);
  const [imageUrlDel, setImageUrlDel] = React.useState("");
  const [isMassal, setIsMassal] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState<string[]>([]);
  const [subCategoryId, setSubCategoryId] = React.useState("");
  const [subDistributorId, setSubDistributorId] = React.useState("");
  const [price, setPrice] = React.useState("");

  const { id } = useParams() as { id: string };
  const user = setUser((v) => v.user);

  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();

  const variantTypes = useGeneralStore((v) => v.variantTypesDetailProduct);
  const setVariantTypes = useGeneralStore(
    (v) => v.setVariantTypesDetailProduct
  );

  const deliveryPrice = useGeneralStore((v) => v.deliveryPrice);
  const setDeliveryPrice = useGeneralStore((v) => v.setDeliveryPrice);
  const clearDeliveryPrice = useGeneralStore((v) => v.clearDeliveryPrice);
  const priceStore = useGeneralStore((v) => v.price);
  const setPriceStore = useGeneralStore((v) => v.setPrice);

  const { update, findById } = useProduct(id);
  const categories = findCategories();
  const subCategories = findSubCategoryByCategoryId(categoryId);

  const [isPopOver, setIsPopOver] = React.useState(false);
  const [productSize, setProductSize] = React.useState("1:1");
  const [currentProductImage, setCurrentProductImage] = React.useState<
    CurrentProductImageProps[]
  >([]);
  const [variantTypesPrev, setVariantTypesPrev] = React.useState<
    VariantTypeProps[]
  >([]);

  const { actionIsDeleteImageProduct, isDeleteImageProduct } = useActiveModal();

  const removeImgProduct = removeImageProduct(id);

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
          size: imageUrl.split("/")[6].split("_")[0],
          src: imageUrl,
        }))
      );
      setVariantTypes(findById.data.variantProduct);
      setVariantTypesPrev(findById.data.variantProduct);

      setCategoryId(findById.data.categoryProduct.category.id);
      setDeliveryPrice(findById.data.deliveryPrice);
      setPriceStore(findById.data.price);
      setImageUrl(findById.data.imageUrl);

      if (findById.data.variantProduct.length < 1) {
        setPrice(Currency(findById.data.price.price ?? 0));
      } else {
        const prices: number[] = [];
        const variantColor = findById.data.variantProduct?.map(
          (e) => e.variantColorProduct
        );

        variantColor?.forEach((e) => {
          e?.forEach((m) => {
            prices.push(m.price ?? 0);
          });
        });

        const min = Currency(Math.min(...prices));
        const max = Currency(Math.max(...prices));
        setPrice(min === max ? max : `${min} - ${max}`);
      }

      setSubCategoryId(findById.data.subCategoryProductId);
      setValue("subCategory", findById.data.subCategoryProduct?.name ?? "-");
      setCategoryId(findById.data.categoryProduct.category.id);
      setValue(
        "variant",
        findById.data.variantProduct?.map((e) => e.name).join(", ")
      );
      setValue("price", price);
      setIsCourierInternal(findById.data.deliveryPrice.isCourierInternal);
      setValue("postage", Currency(findById.data.deliveryPrice.price ?? 0));
      setValue("postage", Currency(findById.data.deliveryPrice.price ?? 0));
      setValue("condition", "Baru");
      setValue("description", findById.data.description);
      if (findById.data.price.priceDiscount) {
        setValue(
          "promotion",
          `(${Currency(
            findById.data.price.priceDiscount ?? 0
          )}) ${epochToDateConvert(
            findById.data.price.startAt ?? 0
          )} - ${epochToDateConvert(findById.data.price.expiredAt ?? 0)}`
        );
      }
    }
  }, [findById.data, findById.data?.imageUrl, imageUrl, price]);

  const onSubmit = handleSubmit(async (e) => {
    setIsLoading(true);
    // ON CREATE VARIANT
    if (variantTypesPrev?.length < variantTypes?.length) {
      variantTypes?.forEach(async (type) => {
        const typePrevByName = variantTypesPrev?.map((prev) => prev.name);
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
    if (variantId?.length) {
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
    if (variantColorId?.length) {
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
    variantTypesPrev?.forEach((typePrev) => {
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
      const price = e.price;
      const newPrice =
        variantTypes.length > 0
          ? parseTextToNumber(price.split("-")[0])
          : parseTextToNumber(price);

      if (!findById.data) return;

      await update.mutateAsync({
        data: {
          name: e.productName,
          deliveryPrice: {
            ...deliveryPrice,
            isCourierInternal,
          },
          category: { categoryId },
          description: e.description,
          subCategoryId: subCategoryId === "-" ? "" : subCategoryId,
          price: {
            ...priceStore,
            price: newPrice,
          },
          createForDistrbutorId: subDistributorId,
          isAvailable: findById.data.isAvailable,
        },
      });

      toast.success("Produk berhasil diperbarui");
      setVariantTypes([]);
      clearDeliveryPrice();
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to update : ${error.message}`);
    } finally {
      clearVariantId();
      clearVariantColorId();
      setIsLoading(false);
    }
  });

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;
    const files = e.target.files[0];

    try {
      setIsLoadingUpdateImage(true);
      const nFile = await onPickImage({
        file: files,
        ratio: productSize === "1:1" ? 1 / 1 : 3 / 4,
      });

      await uploadFile({
        file: nFile.file,
        prefix: `product/${id}/${productSize}_${Date.now()}.png`,
      });
      setIsLoadingUpdateImage(true);
    } catch (e) {
      const error = e as Error;
      console.error(`Gagal menambahkan foto: ${error.message}`);
      toast.error(`Gagal menambahkan foto`);
      setIsLoadingUpdateImage(false);
    }
    setIsPopOver((v) => !v);
  };

  const {
    actionIsCategory,
    actionIsSubCategory,
    actionIsCondition,
    actionIsPostage,
    actionIsVariant,
    actionIsSubDistributor,
    actionIsPrice,
    actionIsPromotion,
    isCategory,
    isSubCategory,
  } = useActiveModal();

  const onIsDeleteModal = (path: string) => {
    if (currentProductImage.length < 2) {
      toast.error("Tidak bisa menghapus foto produk");
      return;
    }
    setImageUrlDel(path);
    actionIsDeleteImageProduct();
  };

  const onProductSize = (size: string) => {
    setProductSize(size);
    onOpenExplorer();
  };

  const onRemoveImage = async (path: string) => {
    try {
      toast.loading("Loading...", { toastId: "loading-remove-image" });
      await removeImgProduct.mutateAsync({
        data: { imageUrl: path },
      });
      toast.success("Foto berhasil dihapus");
      setImageUrlDel("");
      actionIsDeleteImageProduct();
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed remove image: ${error.message}`);
    } finally {
      toast.dismiss("loading-remove-image");
    }
  };

  React.useEffect(() => {
    if (categoryId !== findById.data?.categoryProduct.category.id) {
      setValue("subCategory", "-");
      setSubCategoryId("");
    }
  }, [findById.data, categoryId]);

  const [isLoadingUpdateImage, setIsLoadingUpdateImage] = React.useState(false);

  const imageProductRef = React.useRef<ChildRef>(null);
  const onChangeProductImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;
    const files = e.target.files[0];

    try {
      await removeImgProduct.mutateAsync({
        data: { imageUrl: imageUrlDel },
      });

      const nFile = await onPickImage({
        file: files,
        ratio: productSize === "1:1" ? 1 / 1 : 3 / 4,
      });

      await uploadFile({
        file: nFile.file,
        prefix: `product/${id}/${productSize}_${Date.now()}.png`,
      });
      setIsLoadingUpdateImage(true);
    } catch (e) {
      const error = e as Error;
      console.error(`Error update product image: ${error.message}`);
      toast.error("Gagal memperbarui foto");
      setIsLoadingUpdateImage(false);
    }
  };

  React.useEffect(() => {
    if (isLoadingUpdateImage) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoadingUpdateImage, id]);

  return (
    <>
      {findById.error ? (
        <Error error={findById.error.message} />
      ) : findById.isLoading ? (
        <Skeleton />
      ) : (
        <main className="flex flex-col gap-5 lg:gap-8">
          <header className="flex flex-col gap-4">
            {isLoadingUpdateImage && <Spinner />}
            {!isLoadingUpdateImage && (
              <section className="flex gap-6 items-start flex-wrap">
                {currentProductImage?.map((v, k) => (
                  <ImageFile
                    key={k}
                    onChange={onChangeProductImage}
                    ref={imageProductRef}
                    render={
                      <Image
                        src={v.src}
                        alt={`Product Image ${k + 1}`}
                        className={cx(
                          "w-[10rem] object-cover rounded-md cursor-pointer"
                        )}
                        onClick={() => {
                          if (imageProductRef.current) {
                            imageProductRef.current.click();
                            setImageUrlDel(v.src);
                            setProductSize(v.src.split("/")[6].split("_")[0]);
                          }
                        }}
                        actions={[
                          {
                            src: <HiOutlineTrash size={16} />,
                            onClick: () => onIsDeleteModal(v.name),
                          },
                        ]}
                        loading="lazy"
                      />
                    }
                  />
                ))}

                <Popover placement="right" isOpen={isPopOver}>
                  <PopoverTrigger>
                    <Btn
                      onClick={() => setIsPopOver((v) => !v)}
                      color="primary"
                    >
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
            )}
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 lg:gap-5">
            <Textfield
              name="productName"
              label="nama produk *"
              placeholder="Masukkan nama produk"
              control={control}
              defaultValue={findById.data?.name}
              rules={{
                required: setRequiredField(true, "Masukkan nama Produk"),
              }}
              errorMessage={handleErrorMessage(errors, "productName")}
            />
            <Textfield
              name="category"
              label="kategori *"
              placeholder="pilih kategori"
              control={control}
              defaultValue={findById?.data?.categoryProduct.category.name}
              rules={{
                required: setRequiredField(true, "pilih kategori"),
              }}
              errorMessage={handleErrorMessage(errors, "category")}
              endContent={
                <HiOutlineChevronRight size={16} color={IconColor.zinc} />
              }
              readOnly={{ isValue: true, cursor: "cursor-pointer" }}
              onClick={actionIsCategory}
            />
            <Textfield
              name="subCategory"
              label="sub-kategori"
              placeholder="pilih sub-kategori"
              control={control}
              defaultValue=""
              endContent={
                subCategoryId ? (
                  <HiOutlineXMark
                    size={16}
                    color={IconColor.red}
                    className="cursor-pointer"
                    onClick={() => {
                      setSubCategoryId("");
                      setValue("subCategory", "-");
                    }}
                  />
                ) : (
                  <HiOutlineChevronRight size={16} color={IconColor.zinc} />
                )
              }
              readOnly={{ isValue: true, cursor: "cursor-pointer" }}
              onClick={() => {
                if (!categoryId) {
                  toast.error("Pilih kategori");
                  return;
                }
                actionIsSubCategory();
              }}
            />
            <Textfield
              name="variant"
              label="variasi"
              placeholder="tentukan variasi"
              control={control}
              defaultValue=""
              endContent={
                <HiOutlineChevronRight size={16} color={IconColor.zinc} />
              }
              readOnly={{ isValue: true, cursor: "cursor-pointer" }}
              onClick={actionIsVariant}
            />
            <Textfield
              name="price"
              label="harga *"
              placeholder="masukkan harga"
              control={control}
              defaultValue=""
              errorMessage={handleErrorMessage(errors, "price")}
              endContent={
                variantTypes.length > 0 ? (
                  <HiOutlineChevronRight size={16} color={IconColor.zinc} />
                ) : undefined
              }
              readOnly={
                variantTypes.length > 0
                  ? { isValue: true, cursor: "cursor-pointer" }
                  : undefined
              }
              onClick={variantTypes.length > 0 ? actionIsPrice : undefined}
              rules={{
                required: setRequiredField(true, "masukkan harga"),
                onBlur: (e) =>
                  variantTypes.length > 0
                    ? undefined
                    : CurrencyIDInput({
                        type: "rp",
                        fieldName: "price",
                        setValue,
                        value: e.target.value,
                      }),
              }}
            />
            <Textfield
              name="postage"
              label="ongkos kirim *"
              placeholder="tentukan ongkir"
              control={control}
              defaultValue=""
              rules={{
                required: setRequiredField(true, "tentukan ongkir"),
              }}
              errorMessage={handleErrorMessage(errors, "postage")}
              endContent={
                <HiOutlineChevronRight size={16} color={IconColor.zinc} />
              }
              readOnly={{ isValue: true, cursor: "cursor-pointer" }}
              onClick={actionIsPostage}
            />
            <Textfield
              name="condition"
              label="kondisi *"
              placeholder="pilih kondisi"
              control={control}
              defaultValue="Baru"
              endContent={
                <HiOutlineChevronRight size={16} color={IconColor.zinc} />
              }
              readOnly={{ isValue: true, cursor: "cursor-pointer" }}
              onClick={actionIsCondition}
            />
            {user?.role === RoleDistributor.DISTRIBUTOR && (
              <Textfield
                name="subDistributor"
                label="sub-distributor"
                placeholder="pilih sub-distributor"
                control={control}
                defaultValue=""
                endContent={
                  <HiOutlineChevronRight size={16} color={IconColor.zinc} />
                }
                readOnly={{ isValue: true, cursor: "cursor-pointer" }}
                onClick={actionIsSubDistributor}
              />
            )}
            <Textfield
              name="promotion"
              label="promosi"
              placeholder="atur promosi"
              control={control}
              defaultValue=""
              endContent={
                <HiOutlineChevronRight size={16} color={IconColor.zinc} />
              }
              readOnly={{ isValue: true, cursor: "cursor-pointer" }}
              onClick={actionIsPromotion}
            />
          </main>

          <section className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 gap-4">
            <Textarea
              name="description"
              control={control}
              label="deskripsi produk *"
              defaultValue=""
              rules={{
                required: setRequiredField(true, "masukkan deskripsi"),
              }}
              errorMessage={handleErrorMessage(errors, "description")}
              classNameWrapper="col-span-2"
            />
          </section>

          <Button
            onClick={onSubmit}
            className="mx-auto my-5"
            label={
              isLoading ? <Spinner color="secondary" size="sm" /> : "simpan"
            }
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
            label="Batal"
            variant="flat"
            className="w-full"
            onClick={actionIsDeleteImageProduct}
          />
          <Button
            label="Hapus"
            className="bg-[#c41414] w-full"
            onClick={() => onRemoveImage(imageUrlDel!)}
          />
        </section>
      </Modal>

      <ListingModal
        isOpen={isCategory}
        onClose={actionIsCategory}
        data={categories}
        title="kategori"
        render={(e) => (
          <>
            {e.error && <Error error={e.error} />}
            {e.isLoading && <Spinner className="mx-auto" />}
            {!e.data ? (
              <h1>Tidak ada data</h1>
            ) : (
              e.data.map((v) => (
                <li
                  key={v.id}
                  onClick={() => {
                    setCategoryId(v.id);
                    setValue("category", v.name);
                    clearErrors("subCategory");
                    actionIsCategory();
                  }}
                  className={cx(
                    "hover:font-bold cursor-pointer w-max",
                    v.id === categoryId && "font-bold"
                  )}
                >
                  {v.name}
                </li>
              ))
            )}
          </>
        )}
      />

      <ListingModal
        isOpen={isSubCategory}
        onClose={actionIsSubCategory}
        data={subCategories}
        title="sub-kategori"
        render={(e) => (
          <>
            {e.error && <Error error={e.error} />}
            {e.isLoading && <Spinner className="mx-auto" />}
            {!e.data ? (
              <h1 className="text-center">Tidak ada data</h1>
            ) : (
              e.data.map((v) => (
                <li
                  key={v.id}
                  onClick={() => {
                    setSubCategoryId(v.id);
                    actionIsSubCategory();
                    setValue("subCategory", v.name);
                    clearErrors("subCategory");
                  }}
                  className={cx(
                    "hover:font-bold cursor-pointer w-max",
                    v.id === subCategoryId && "font-bold"
                  )}
                >
                  {v.name}
                </li>
              ))
            )}
          </>
        )}
      />

      {/* <DangerousModal setValue={setValue} /> */}
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
        isCourierInternal={isCourierInternal}
        setIsCourierInternal={() => setIsCourierInternal((v) => !v)}
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
        normalPrice={price}
        setValue={setValue}
        images={findById.data?.imageUrl ?? []}
        productName={findById.data?.name ?? "-"}
        description={findById.data?.description ?? "-"}
        price={parseTextToNumber(price)}
        productData={findById.data}
        productId={id}
      />
      <SubDistributorModal
        clearErrors={clearErrors}
        setValue={setValue}
        setDistributorId={setSubDistributorId}
        subDistributorId={subDistributorId}
      />
    </>
  );
};

export default Detail;
