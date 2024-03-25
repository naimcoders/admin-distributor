import cx from "classnames";
import { Button as Btn, Switch } from "@nextui-org/react";
import { ChangeEvent, FC, KeyboardEvent, useEffect, useState } from "react";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import useGeneralStore, {
  VariantTypeProps,
  useVariantIdStore,
} from "src/stores/generalStore";
import { IconColor, UseForm } from "src/types";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useActiveModal } from "src/stores/modalStore";
import { FieldValues, useForm } from "react-hook-form";
import { useUploadProduct } from "../Create";
import { ItemVariant } from "src/components/VariantItem";
import VariantImage from "src/components/ImageVariant";
import { toast } from "react-toastify";
import { useVariant as useVariantApi } from "src/api/variant.service";

interface VariantModalProps extends Pick<UseForm, "setValue"> {
  fieldName: string;
}

export const VariantModal: FC<VariantModalProps> = ({
  fieldName,
  setValue,
}) => {
  const variantTypes = useGeneralStore((v) => v.variantTypes);
  const setVariantTypes = useGeneralStore((v) => v.setVariantType);

  const {
    isAddType,
    isDeleteType,
    actionIsVariant,
    handleAddType,
    handleChangeType,
    handleDeleteType,
    handleSubmitType,
    isVariant,
    isDeleteSize,
    handleChangeSize,
    isAddSize,
    handleAddSize,
    handleOnKeyDownSize,
    handleSubmitSize,
    labelAndImage,
    setLabelAndImage,
    handleDeleteSize,
    formType,
    formSize,
    handleOnKeyDownType,
    handleSubmitVariant,
    isErrorVariant,
    isVariantPhoto,
    setIsErrorVariant,
    setIsVariantPhoto,
    onDisabled,
  } = useVariant({ variantTypes, setVariantTypes });

  const [labelProduct, setLabelProduct] = useState("");
  const { productPhotoRef } = useUploadProduct();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;
    const files = e.target.files[0];
    const blob = URL.createObjectURL(files);
    const [datas] = variantTypes.filter((f) => f.name === labelProduct);
    datas.files = files;
    datas.imageUrl = blob;

    let setImageValues: VariantTypeProps[] = [];
    let error = 0;

    variantTypes.forEach((e) => {
      if (e.name === labelProduct) setImageValues.push(datas);
      if (e.name !== labelProduct) setImageValues.push(e);
      if (isVariantPhoto && e.imageUrl) error++;
    });
    setVariantTypes([...setImageValues]);

    if (error > 0) setIsErrorVariant(false);
  };

  const onClick = (label: string) => {
    if (productPhotoRef.current) {
      productPhotoRef.current.click();
      setLabelProduct(label);
    }
  };

  const onClickType = (label: string) => setLabelAndImage({ label });
  const onShowVariantImage = () => setIsVariantPhoto((v) => !v);

  const onSubmit = () => {
    const disabled = onDisabled();
    if (disabled.length) {
      toast.error(`Masukkan ukuran tipe ${disabled[0]}`);
      return;
    }

    handleSubmitVariant("create", fieldName, setValue);
  };

  const onDeleteImageVariant = (name: string) => {
    const mapping = variantTypes.map((type) => ({
      ...type,
      name: type.name,
      variantColorProduct: type.variantColorProduct,
      imageUrl: name === type.name ? "" : type.imageUrl,
    }));
    setVariantTypes(mapping);
  };

  useEffect(() => {
    if (isAddType) formType.setFocus("type");
    if (isAddSize) formSize.setFocus("size");
    if (!labelAndImage?.label) {
      setLabelAndImage({
        label: variantTypes[0]?.name,
      });
    }
  }, [isAddType, isAddSize, variantTypes]);

  return (
    <Modal isOpen={isVariant} closeModal={actionIsVariant}>
      <main className="my-4 flexcol gap-6">
        <ItemVariant
          title="warna/jenis/tipe"
          control={formType.control}
          variantTypes={variantTypes}
          errors={formType.formState.errors}
          add={{
            errorMessage: "masukkan warna/jenis/tipe",
            fieldName: "type",
            isAdd: isAddType,
            onAdd: handleAddType,
            onKeyDown: handleOnKeyDownType,
            onSubmit: handleSubmitType,
          }}
          update={{ isUpdate: isDeleteType, onEdit: handleChangeType }}
        >
          {variantTypes.length > 0 &&
            variantTypes.map((v, idx) => (
              <section className="relative flex-grow" key={idx}>
                <Btn
                  size="sm"
                  variant="light"
                  className={cx(
                    "border border-gray-300 text-gray-500 bg-gray-100 w-full",
                    labelAndImage?.label === v.name &&
                      "border border-blue-700 bg-white"
                  )}
                  onClick={() => onClickType(v.name ?? "")}
                >
                  {v.name}
                </Btn>
                {isDeleteType && (
                  <XCircleIcon
                    width={20}
                    color={IconColor.red}
                    className="absolute -top-2 -right-2 cursor-pointer"
                    title="hapus sss"
                    onClick={() => handleDeleteType(v.name ?? "", v.id ?? "")}
                  />
                )}
              </section>
            ))}
        </ItemVariant>
        <hr />
        <section className="flex justify-between">
          <section>
            <h2>Tambah foto ke variasi "Warna/Jenis/Tipe"</h2>
            <p className={`text-sm text-[${IconColor.zinc}]`}>
              Semua foto harus diupload apabila diaktifkan
            </p>
          </section>
          <Switch
            size="sm"
            color="success"
            isSelected={isVariantPhoto}
            onClick={onShowVariantImage}
          />
        </section>

        {isVariantPhoto && variantTypes.length > 0 && (
          <>
            <section className="grid lg:grid-cols-3 grid-cols-1 sm:grid-cols-2 gap-2">
              {variantTypes.map((v, k) => (
                <VariantImage
                  onDeleteImage={onDeleteImageVariant}
                  label={v.name ?? ""}
                  image={v.imageUrl ?? ""}
                  onClick={() => onClick(v.name ?? "")}
                  onChange={onChange}
                  ref={productPhotoRef}
                  variantTypes={variantTypes}
                  setVariantTypes={setVariantTypes}
                  key={k}
                />
              ))}
            </section>
          </>
        )}
        {isErrorVariant && <p className="text-sm text-red-500">Upload foto</p>}
        <hr />
        <ItemVariant
          title="ukuran"
          control={formSize.control}
          variantTypes={variantTypes}
          errors={formSize.formState.errors}
          add={{
            errorMessage: "masukkan ukuran",
            fieldName: "size",
            isAdd: isAddSize,
            onAdd: handleAddSize,
            onKeyDown: handleOnKeyDownSize,
            onSubmit: handleSubmitSize,
          }}
          update={{ isUpdate: isDeleteSize, onEdit: handleChangeSize }}
          isActiveItem={!labelAndImage?.label}
        >
          {!labelAndImage?.label ? (
            <p className={`text-sm text-[${IconColor.zinc}]`}>
              Pilih warna/jenis/tipe di atas untuk mengatur ukuran
            </p>
          ) : (
            <>
              {variantTypes
                .filter((f) => f.name === labelAndImage?.label)
                .map((v) =>
                  v.variantColorProduct.map((s, idx) => (
                    <section className="relative flex-grow" key={idx}>
                      <Btn
                        size="sm"
                        variant="light"
                        className="border border-gray-300 text-gray-500 w-full bg-gray-100"
                      >
                        {s.name}
                      </Btn>
                      {isDeleteSize && (
                        <XCircleIcon
                          width={20}
                          color={IconColor.red}
                          className="absolute -top-2 -right-2 cursor-pointer"
                          title="hapus"
                          onClick={() => handleDeleteSize(s.name, s.id!)}
                        />
                      )}
                    </section>
                  ))
                )}
            </>
          )}
        </ItemVariant>
        <Button
          aria-label="simpan"
          className="mx-auto mt-4"
          onClick={onSubmit}
        />
      </main>
    </Modal>
  );
};

interface LabelAndImageProps {
  label?: string;
  image?: string;
  size?: { label?: string; price?: string }[];
}

export interface UseVariantProps {
  variantTypes: VariantTypeProps[];
  setVariantTypes: (v: VariantTypeProps[]) => void;
  productId?: string;
}

export const useVariant = ({
  variantTypes,
  setVariantTypes,
  productId,
}: UseVariantProps) => {
  const formType = useForm<FieldValues>();
  const formSize = useForm<FieldValues>();

  const [isVariantPhoto, setIsVariantPhoto] = useState(true);
  const [isErrorVariant, setIsErrorVariant] = useState(false);
  const [isDeleteType, setIsDeleteTye] = useState(false);
  const [isDeleteSize, setIsDeleteSize] = useState(false);
  const [isAddType, setIsAddType] = useState(false);
  const [isAddSize, setIsAddSize] = useState(false);
  const [labelAndImage, setLabelAndImage] = useState<LabelAndImageProps>();
  const { isVariant, actionIsVariant, actionIsPrice } = useActiveModal();

  const handleAddType = () => setIsAddType((v) => !v);
  const handleAddSize = () => setIsAddSize((v) => !v);
  const handleChangeType = () => setIsDeleteTye((v) => !v);
  const handleChangeSize = () => setIsDeleteSize((v) => !v);

  const checkVariantName = (value: string) => {
    const variantByName = variantTypes.map((type) => type.name);
    return variantByName.includes(value);
  };

  const checkVariantSize = (value: string): boolean => {
    const [typeByName] = variantTypes.filter(
      (e) => e.name === labelAndImage?.label
    );
    const sizeByName = typeByName.variantColorProduct.map((e) => e.name);
    return sizeByName.includes(value);
  };

  const { removeImage } = useVariantApi(productId ?? "");
  const handleSubmitVariant = (
    prefix: "detail" | "create",
    fieldName: string,
    setValue: Pick<UseForm, "setValue">["setValue"]
  ) => {
    let error = 0;
    variantTypes.forEach((e) => {
      if (isVariantPhoto && !e.imageUrl) error++;
    });

    if (prefix === "detail") {
      if (variantTypes.length > 0 && !isVariantPhoto) {
        variantTypes.forEach(async (v) => {
          if (!v.imageUrl) return;
          try {
            const obj = { imageUrl: v.imageUrl ?? "" };
            await removeImage.mutateAsync({
              variantId: v.id ?? "",
              data: obj,
            });
          } catch (e) {
            const error = e as Error;
            console.error(error.message);
          }
        });
      }
    }

    if (error > 0) setIsErrorVariant(true);
    else {
      if (variantTypes.length > 0) {
        const value = variantTypes.map((m) => m.name).join(", ");
        setValue(fieldName, value);
        actionIsVariant();
        setTimeout(actionIsPrice, 500);
      } else {
        setValue(fieldName, "");
        setValue("price", "");
        actionIsVariant();
      }
    }
  };

  // const handleSubmitVariant = (
  //   fieldName: string,
  //   setValue: Pick<UseForm, "setValue">["setValue"]
  // ) => {
  //   let error = 0;
  //   variantTypes.forEach((e) => {
  //     if (isVariantPhoto && !e.imageUrl) error++;
  //   });

  //   // if (!isVariantPhoto) {
  //   //   setVariantTypes(
  //   //     variantTypes.map((v) => ({
  //   //       name: v.name,
  //   //       imageUrl: "",
  //   //       variantColorProduct: v.variantColorProduct,
  //   //     }))
  //   //   );
  //   // }

  //   if (error > 0) setIsErrorVariant(true);
  //   else {
  //     if (variantTypes.length > 0) {
  //       const value = variantTypes.map((m) => m.name).join(", ");
  //       setValue(fieldName, value);
  //       actionIsVariant();
  //       setTimeout(actionIsPrice, 500);
  //     } else {
  //       setValue(fieldName, "");
  //       setValue("price", "");
  //       actionIsVariant();
  //     }
  //   }
  // };

  const onDisabled = (): string[] => {
    let types: string[] = [];
    variantTypes.forEach((e) => {
      const variantProduct = e.variantColorProduct;
      if (variantProduct.length < 1) types.push(e.name);
    });
    return types;
  };

  const handleSubmitType = formType.handleSubmit((e) => {
    const type = e.type;
    if (checkVariantName(type)) {
      toast.error(`Tipe ${type} sudah ada`);
      formType.reset();
      return;
    }
    setVariantTypes([...variantTypes, { name: type, variantColorProduct: [] }]);
    formType.setFocus("type");
    formType.resetField("type");
  });

  const handleSubmitSize = formSize.handleSubmit((e) => {
    const val = e.size;
    if (checkVariantSize(val)) {
      toast.error(`Ukuran ${val} sudah ada`);
      formSize.reset();
      return;
    }
    const [typeByName] = variantTypes.filter(
      (type) => type.name === labelAndImage?.label
    );
    typeByName.variantColorProduct.push({ name: val, id: "" });
    formSize.setFocus("size");
    formSize.resetField("size");
  });

  const handleOnKeyDownSize = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = formSize.getValues().size;
      if (!val) {
        formSize.setError("size", { message: "masukkan ukuran" });
        return;
      }

      if (checkVariantSize(val)) {
        toast.error(`Ukuran ${val} sudah ada`);
        formSize.reset();
        return;
      }

      const [typeByName] = variantTypes.filter(
        (type) => type.name === labelAndImage?.label
      );
      typeByName.variantColorProduct.push({ name: val, id: "" });
      formSize.setFocus("size");
      formSize.resetField("size");
    }
    if (e.key === "Escape") setIsAddSize((v) => !v);
  };

  const handleOnKeyDownType = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const type = formType.getValues().type;
      if (!type) {
        formType.setError("type", {
          message: "masukkan warna/jenis/tipe",
        });
        return;
      }

      if (checkVariantName(type)) {
        toast.error(`Tipe ${type} sudah ada`);
        formType.reset();
        return;
      }
      setVariantTypes([
        ...variantTypes,
        { name: type, variantColorProduct: [] },
      ]);
      formType.setFocus("type");
      formType.resetField("type");
      formType.setFocus("type");
    }
    if (e.key === "Escape") setIsAddType((v) => !v);
  };

  const setVariantId = useVariantIdStore((v) => v.setVariantId);
  const setVariantColorId = useVariantIdStore((v) => v.setVariantColorId);

  const handleDeleteType = (label: string, id: string) => {
    setVariantId(id);
    const newTypes = variantTypes.filter((type) => type.name !== label);
    setVariantTypes(newTypes);
  };

  const handleDeleteSize = (val: string, id: string) => {
    setVariantColorId(id);
    const [typeByName] = variantTypes.filter(
      (type) => type.name === labelAndImage?.label
    );
    const subVariant = typeByName.variantColorProduct.filter(
      (subVariant) => subVariant.name !== val
    );
    const mappingType = variantTypes.map((type) => ({
      ...type,
      variantColorProduct:
        labelAndImage?.label === type.name
          ? subVariant
          : type.variantColorProduct,
    }));
    setVariantTypes(mappingType);
  };

  return {
    onDisabled,
    isVariantPhoto,
    setIsVariantPhoto,
    isErrorVariant,
    setIsErrorVariant,
    handleSubmitVariant,
    formType,
    handleDeleteSize,
    labelAndImage,
    setLabelAndImage,
    handleOnKeyDownSize,
    handleSubmitSize,
    isDeleteSize,
    handleChangeSize,
    handleOnKeyDownType,
    isVariant,
    actionIsVariant,
    handleDeleteType,
    handleAddType,
    handleChangeType,
    handleSubmitType,
    isDeleteType,
    isAddType,
    isAddSize,
    handleAddSize,
    formSize,
  };
};
