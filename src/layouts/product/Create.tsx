import square from "src/assets/images/square.png";
import rectangle from "src/assets/images/rectangle.png";
import cx from "classnames";
import Image from "src/components/Image";
import Textarea from "src/components/Textarea";
import PriceModal from "./Modals/Price";
import useGeneralStore from "src/stores/generalStore";
import {
  HiOutlineChevronRight,
  HiOutlineTrash,
  HiOutlineXMark,
} from "react-icons/hi2";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { ChildRef, File as FileComp } from "src/components/File";
import { Textfield } from "src/components/Textfield";
import {
  CurrencyIDInput,
  handleErrorMessage,
  parseTextToNumber,
  setRequiredField,
} from "src/helpers";
import { IconColor } from "src/types";
import { useActiveModal } from "src/stores/modalStore";
import {
  Button as Btn,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Spinner,
} from "@nextui-org/react";
import { Button } from "src/components/Button";
import { DangerousModal } from "./Modals/Dangerous";
import { PostageModal } from "./Modals/Postage";
import { ConditionModal } from "./Modals/Condition";
import { ListingModal } from "./Modals/Category";
import { VariantModal } from "./Modals/Variant";
import { useProduct } from "src/api/product.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { uploadFile } from "src/firebase/upload";
import { onPickImage } from "src/helpers/crop-image";
import { setUser } from "src/stores/auth";
import { RoleDistributor } from "src/api/distributor.service";
import { SubDistributorModal } from "./Modals/SubDistributor";
import { findCategories } from "src/api/category.service";
import { findSubCategoryByCategoryId } from "src/api/product-category.service";
import Error from "src/components/Error";
import { v4 as uuidv4 } from "uuid";
import { FbFirestore } from "src/firebase";

const removeAsterisks = (input: string): string =>
  input.replace(/\*\*(.*?)\*\*/g, "$1");

const Create = () => {
  const [isMassal, setIsMassal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCourierInternal, setIsCourierInternal] = useState(true);
  const [subDistributorId, setSubDistributorId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  const user = setUser((v) => v.user);

  const {
    reset,
    control,
    setValue,
    clearErrors,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FieldValues>();

  const {
    actionIsSubCategory,
    actionIsCategory,
    actionIsVariant,
    actionIsPrice,
    actionIsPostage,
    actionIsCondition,
    actionIsSubDistributor,
    isCategory,
    isSubCategory,
  } = useActiveModal();

  const {
    productPhotoRef,
    onChange,
    photos,
    setPhotos,
    isPopOver,
    setIsPopOver,
    onProductSize,
    productDescription,
    setProductDescription,
    isLoadingProductDesc,
    isLoadingProductImage,
  } = useUploadProduct();

  const navigate = useNavigate();
  const { create } = useProduct();

  const variantTypes = useGeneralStore((v) => v.variantTypes);
  const setVariantType = useGeneralStore((v) => v.setVariantType);
  const deliveryPrice = useGeneralStore((v) => v.deliveryPrice);
  const clearDeliveryPrice = useGeneralStore((v) => v.clearDeliveryPrice);

  const categories = findCategories();
  const subCategories = findSubCategoryByCategoryId(categoryId);

  // ONSUBMIT
  const onSubmit = handleSubmit(async (e) => {
    if (photos.length < 1) {
      toast.error("Tambah foto produk");
      return;
    }

    if (e.price === "0") {
      setError("price", { message: "Masukkan harga" });
      return;
    }

    try {
      setIsLoading(true);
      const price = e.price as string;
      const newPrice =
        variantTypes.length > 0
          ? parseTextToNumber(price.split("-")[0])
          : parseTextToNumber(price);
      const variants = variantTypes.map((v) => ({
        name: v.name,
        imageUrl: "",
        variantColorProduct: v.variantColorProduct.map((o) => ({
          name: o.name,
          price: o.price,
        })),
      }));

      const result = await create.mutateAsync({
        data: {
          category: { categoryId },
          name: e.productName,
          deliveryPrice,
          variant: variants,
          createForDistrbutorId: subDistributorId,
          description: e.description,
          subCategoryId,
          isAvailable: true,
          price: {
            fee: 0,
            startAt: 0,
            expiredAt: 0,
            price: newPrice,
            priceDiscount: 0,
          },
        },
      });

      // ON UPLOAD IMAGE PRODUCTS
      if (photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          const imageUri = photos[i];
          if (!imageUri.file) return;
          const filename = `${imageUri.size}_${Date.now()}.png`;
          await uploadFile({
            file: imageUri.file,
            prefix: `product/${result.id}/${filename}`,
          });
        }
      }

      const variantLength = result.variantProduct.length;

      // ON UPLOAD PRODUCTS VARIANT IMAGE
      if (variantLength > 0) {
        for (let v = 0; v < variantLength; v++) {
          const variantFiles = variantTypes[v];
          const variantResult = result.variantProduct[v];
          if (!variantFiles.files) return;
          if (variantFiles.name === variantResult.name) {
            await uploadFile({
              file: variantFiles.files,
              prefix: `product_variant/${variantResult.id}/${Date.now()}.png`,
            });
          }
        }
      }

      // console.log({
      //   category: { categoryId },
      //   name: e.productName,
      //   deliveryPrice,
      //   variant: variants,
      //   createForDistrbutorId: subDistributorId,
      //   description: e.description,
      //   subCategoryId,
      //   isAvailable: true,
      //   price: {
      //     fee: 0,
      //     startAt: 0,
      //     expiredAt: 0,
      //     price: newPrice,
      //     priceDiscount: 0,
      //   },
      // });

      setPhotos([]);
      setVariantType([]);
      setCategoryId("");
      setSubCategoryId("");
      clearDeliveryPrice();
      reset();
      toast.success("Produk berhasil dibuat");
      setProductDescription("");
      navigate(-1);
    } catch (e) {
      const error = e as Error;
      console.error(`Failed to create product : ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (productDescription) {
      setValue("description", removeAsterisks(productDescription));
    }
  }, [productDescription]);

  useEffect(() => {
    if (!subCategories.data?.length) {
      setSubCategoryId("");
      setValue("subCategory", "");
    }
  }, [subCategories]);

  useEffect(() => {
    const subCategoryById = subCategories.data?.filter(
      (f) => f.id === subCategoryId
    );
    if (!subCategoryById?.length) {
      setValue("subCategory", "");
      setSubCategoryId("");
    }
  }, [subCategories, categoryId]);

  return (
    <main className="flex flex-col gap-5 lg:gap-8">
      <header className="flex flex-col gap-4">
        <section className="flex gap-6 items-start flex-wrap">
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
                  src: <HiOutlineTrash size={16} />,
                  onClick: () => setPhotos(photos.filter((e) => e !== v)),
                },
              ]}
            />
          ))}

          {isLoadingProductImage ? (
            <Spinner size="md" />
          ) : (
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
                      onChange={(e) => onChange(e)}
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
                          onClick={() => onProductSize(v)}
                        />
                      }
                    />
                  ))}
                </section>
              </PopoverContent>
            </Popover>
          )}
        </section>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 lg:gap-5">
        <Textfield
          name="productName"
          label="nama produk *"
          placeholder="Masukkan nama produk"
          control={control}
          defaultValue=""
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
          defaultValue=""
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
            !subCategoryId ? (
              <HiOutlineChevronRight size={16} color={IconColor.zinc} />
            ) : (
              <HiOutlineXMark
                size={16}
                color={IconColor.red}
                className="cursor-pointer"
                onClick={() => {
                  setSubCategoryId("");
                  setValue("subCategory", "");
                }}
              />
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
      </main>

      {isLoadingProductDesc ? (
        <div className="flex flex-col gap-3 justify-center items-center">
          <Spinner size="md" />
          <h2>Memuat deskripsi...</h2>
        </div>
      ) : (
        <section className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 gap-4">
          <Textarea
            name="description"
            control={control}
            label="deskripsi produk *"
            defaultValue=""
            placeholder="Masukkan deskripsi"
            rules={{
              required: setRequiredField(true, "masukkan deskripsi"),
            }}
            errorMessage={handleErrorMessage(errors, "description")}
            classNameWrapper="col-span-2"
          />
        </section>
      )}

      <Button
        onClick={onSubmit}
        className="mx-auto my-5"
        label={isLoading ? <Spinner size="sm" color="secondary" /> : "simpan"}
      />

      <ListingModal
        isOpen={isCategory}
        onClose={actionIsCategory}
        data={categories}
        title="kategori"
        render={(e) => (
          <>
            {e.error ? (
              <Error error={e.error} />
            ) : e.isLoading ? (
              <Spinner className="mx-auto" />
            ) : !e.data ? (
              <h1 className="font-semibold text-center">Tidak ada data</h1>
            ) : (
              e.data?.map((v) => (
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
            {e.error ? (
              <Error error={e.error} />
            ) : e.isLoading ? (
              <Spinner className="mx-auto" />
            ) : !e.data ? (
              <h1 className="font-semibold text-center">Tidak ada data</h1>
            ) : (
              e.data?.map((v) => (
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

      <DangerousModal setValue={setValue} />
      <ConditionModal setValue={setValue} />
      <PostageModal
        setValue={setValue}
        clearErrors={clearErrors}
        isCourierInternal={isCourierInternal}
        setIsCourierInternal={() => setIsCourierInternal((v) => !v)}
      />
      <VariantModal fieldName="variant" setValue={setValue} />
      <PriceModal
        fieldName="price"
        setValue={setValue}
        clearErrors={clearErrors}
        isMassal={isMassal}
        setIsMassal={setIsMassal}
        variantTypes={variantTypes}
      />
      <SubDistributorModal
        setValue={setValue}
        clearErrors={clearErrors}
        setDistributorId={setSubDistributorId}
        subDistributorId={subDistributorId}
      />
    </main>
  );
};

export interface CurrentProductImageProps {
  src: string;
  name: string;
  size: string;
  file?: File;
}

export const useUploadProduct = () => {
  const [isPopOver, setIsPopOver] = useState(false);
  const [photos, setPhotos] = useState<CurrentProductImageProps[]>([]);
  const [productSize, setProductSize] = useState("1:1");
  const productPhotoRef = useRef<ChildRef>(null);
  const [productDescription, setProductDescription] = useState("");
  const [isLoadingProductImage, setIsLoadingProductImage] = useState(false);
  const [isLoadingProductDesc, setIsLoadingProductDesc] = useState(false);

  const handleProductSize = (size: string) => setProductSize(size);

  const onClick = () => {
    if (productPhotoRef.current) {
      productPhotoRef.current.click();
    }
  };

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = e.target.files[0];
    const nFile = await onPickImage({
      file: files,
      ratio: productSize === "1:1" ? 1 / 1 : 3 / 4,
    });

    try {
      setIsLoadingProductImage(true);
      setIsLoadingProductDesc(true);
      const uuidProduct = uuidv4();
      const path = `temp/image_suggestion/${uuidProduct}/${Date.now()}.jpg`;
      await uploadFile({ file: nFile.file, prefix: path });

      const db = FbFirestore.collection("products_description").doc(
        `${uuidProduct}`
      );
      db.onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data() as { text: string[] };
          setProductDescription(data.text[0]);
          setIsLoadingProductDesc(false);
        }
      });
    } catch (e) {
      const error = e as Error;
      console.error(`Failed to submit product image: ${error.message}`);
    } finally {
      setIsLoadingProductImage(false);
    }

    setPhotos([
      ...photos,
      { src: nFile.url, size: productSize, name: files.name, file: nFile.file },
    ]);
    setIsPopOver((v) => !v);
  };

  const onProductSize = (size: string) => {
    handleProductSize(size);
    onClick();
  };

  return {
    onProductSize,
    productPhotoRef,
    onClick,
    onChange,
    photos,
    setPhotos,
    handleProductSize,
    isPopOver,
    setIsPopOver,
    productDescription,
    setProductDescription,
    isLoadingProductDesc,
    isLoadingProductImage,
  };
};

export default Create;
