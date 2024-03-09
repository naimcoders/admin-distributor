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
import { Currency, handleErrorMessage } from "src/helpers";
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
import { VariantModal } from "./Modals/Variant";
import useGeneralStore from "src/stores/generalStore";

const useProductImage = () => {
  const [isPopOver, setIsPopOver] = React.useState(false);
  const [productSize, setProductSize] = React.useState("1:1");
  const [currentProductImage, setCurrentProductImage] = React.useState<
    CurrentProductImageProps[]
  >([]);

  const productImageRef = React.useRef<ChildRef>(null);
  const onOpenExplorer = () => {
    if (productImageRef.current) {
      productImageRef.current.click();
    }
  };

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

  return {
    currentProductImage,
    setCurrentProductImage,
    isPopOver,
    setIsPopOver,
    onOpenExplorer,
    onChange,
    setProductSize,
    productImageRef,
  };
};

const Detail = () => {
  const {
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>();

  const {
    currentProductImage,
    setCurrentProductImage,
    isPopOver,
    setIsPopOver,
    onOpenExplorer,
    onChange,
    setProductSize,
    productImageRef,
  } = useProductImage();

  const { fields, isLoading, error, data, categoryId, setCategoryId } =
    useFields();

  React.useEffect(() => {
    if (data?.imageUrl) {
      data.imageUrl.forEach((e) => {
        setCurrentProductImage([
          ...currentProductImage,
          { name: e, size: "1:1", src: e },
        ]);
      });
    }
  }, [data]);

  const setVariantTypes = useGeneralStore((v) => v.setVariantType);
  React.useEffect(() => {
    if (data?.variantProduct) {
      setVariantTypes(data.variantProduct);
    }
  }, [data]);

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
              {/* {data?.imageUrl.map((v, k) => (
                <Image
                  src={v}
                  key={k}
                  alt="Product Image"
                  className={cx("w-[10rem] object-cover rounded-md")}
                  actions={[
                    {
                      src: <TrashIcon width={16} />,
                      onClick: () => console.log(v),
                    },
                  ]}
                />
              ))} */}

              {currentProductImage.map((v) => (
                <Image
                  src={v.src}
                  alt="Product"
                  key={v.src}
                  className={cx("w-[10rem] object-cover rounded-md", v.size)}
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
                    type={v.type}
                    control={control}
                    errorMessage={handleErrorMessage(errors, v.name)}
                    // readOnly={variantTypes.length > 1 ? v.readOnly : undefined}
                    // onClick={variantTypes.length > 1 ? v.onClick : undefined}
                    rules={{
                      required: v.rules?.required,
                      // onBlur:
                      //   variantTypes.length < 1
                      //     ? (e) =>
                      //         CurrencyIDInput({
                      //           type: v.type!,
                      //           fieldName: v.name,
                      //           setValue,
                      //           value: e.target.value,
                      //         })
                      //     : undefined,
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
                    defaultValue={v.defaultValue}
                    classNameWrapper="col-span-2"
                    errorMessage={handleErrorMessage(errors, v.name)}
                    rules={{
                      required: { value: true, message: v.errorMessage! },
                    }}
                  />
                )
            )}
          </main>

          <Button aria-label="simpan" className="mx-auto mt-5" />
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
      <VariantModal fieldName="variant" setValue={setValue} />
      <PostageModal
        setValue={setValue}
        clearErrors={clearErrors}
        data={data?.deliveryPrice}
      />
    </>
  );
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

  const [categoryId, setCategoryId] = React.useState("");
  const [subCategoryId, setSubCategoryId] = React.useState("");

  const { id } = useParams() as { id: string };
  const { isLoading, error, data } = useProduct().findById(id);

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
      defaultValue: data?.name,
      rules: { required: { value: true, message: "Masukkan nama produk" } },
    }),
    objectFields({
      label: "kategori *",
      name: "category",
      type: "modal",
      defaultValue: data?.categoryProduct.category.name,
      onClick: actionIsCategory,
      rules: { required: { value: true, message: "Pilih kategori" } },
    }),
    objectFields({
      label: "sub-kategori",
      name: "subCategory",
      type: "modal",
      onClick: onClickSubCategory,
      defaultValue: data?.subCategoryProduct?.name ?? "-",
    }),
    objectFields({
      label: "produk berbahaya",
      name: "dangerous",
      type: "modal",
      onClick: actionIsDangerous,
      defaultValue: data?.isDangerous ? "Ya" : "Tidak",
    }),
    objectFields({
      label: "variasi",
      name: "variant",
      type: "modal",
      defaultValue: data?.variantProduct.map((m) => m.name).join(", "),
      placeholder: "tentukan variasi",
      onClick: actionIsVariant,
    }),
    objectFields({
      label: "harga (Rp) *",
      name: "price",
      type: "rp",
      placeholder: "masukkan harga",
      defaultValue: Currency(data?.price.price ?? 0),
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
      label: "deskripsi *",
      name: "description",
      type: "textarea",
      defaultValue: data?.description,
    }),
  ];

  return {
    fields,
    categoryId,
    setCategoryId,
    subCategoryId,
    setSubCategoryId,
    isLoading,
    error,
    data,
  };
};

export default Detail;
