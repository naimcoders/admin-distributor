import cx from "classnames";
import { Button as Btn, Switch } from "@nextui-org/react";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import useGeneralStore, { VariantTypeProps } from "src/stores/generalStore";
import { IconColor, UseForm } from "src/types";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useUploadProduct } from "../Create";
import { ItemVariant } from "src/components/VariantItem";
import { useVariant } from "./Variant";
import React from "react";
import VariantImage from "src/components/ImageVariant";

interface VariantModalProps extends Pick<UseForm, "setValue"> {
  fieldName: string;
}

export const VariantDetailProductModal: React.FC<VariantModalProps> = ({
  fieldName,
  setValue,
}) => {
  const variantTypes = useGeneralStore((v) => v.variantTypesDetailProduct);
  const setVariantTypes = useGeneralStore(
    (v) => v.setVariantTypesDetailProduct
  );

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
  } = useVariant({ variantTypes, setVariantTypes });

  const [labelProduct, setLabelProduct] = React.useState("");
  const { productPhotoRef } = useUploadProduct();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;
    const files = e.target.files[0];
    const blob = URL.createObjectURL(files);
    const [datas] = variantTypes.filter((f) => f.name === labelProduct);
    datas.files = files;
    datas.imageUrl = blob;

    const setImageValues: VariantTypeProps[] = [];
    let error = 0;

    variantTypes.forEach((e) => {
      if (e.name === labelProduct) setImageValues.push(datas);
      if (e.name !== labelProduct) setImageValues.push(e);
      if (isVariantPhoto && e.imageUrl) error++;
    });
    setVariantTypes([...setImageValues]);
    if (error > 1) setIsErrorVariant(false);
  };

  const onClick = (label: string) => {
    if (productPhotoRef.current) {
      productPhotoRef.current.click();
      setLabelProduct(label);
    }
  };

  const onClickType = (label: string) => setLabelAndImage({ label });

  const onShowVariantImage = () => {
    const newVariant = variantTypes.map((item) => {
      const newItem = { ...item };
      delete newItem.imageUrl;
      delete newItem.files;
      return newItem;
    });
    setVariantTypes(newVariant);
    setIsVariantPhoto((v) => !v);
  };

  React.useEffect(() => {
    if (isAddType) formType.setFocus("type");
    if (isAddSize) formSize.setFocus("size");
    if (!labelAndImage?.label) {
      setLabelAndImage({
        label: variantTypes[0]?.name,
      });
    }
    if (variantTypes.length < 1) setLabelAndImage({ label: "" });
  }, [isAddType, isAddSize, variantTypes]);

  return (
    <Modal isOpen={isVariant} closeModal={actionIsVariant}>
      <main className="my-4 flexcol gap-6">
        <ItemVariant
          title="warna/jenis/tipe"
          control={formType.control}
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
              <section className="relative" key={idx}>
                <Btn
                  size="sm"
                  variant="light"
                  className={cx(
                    "w-[6rem] border border-gray-300 text-gray-500",
                    labelAndImage?.label === v.name && "border border-blue-800"
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
                    title="hapus"
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
            <section className="grid grid-cols-3 gap-2">
              {variantTypes.map((v, k) => (
                <React.Fragment key={k}>
                  <VariantImage
                    label={v.name ?? ""}
                    image={v.imageUrl ?? ""}
                    onChange={onChange}
                    ref={productPhotoRef}
                    onClick={() => onClick(v.name ?? "")}
                    variantTypes={variantTypes}
                    setVariantTypes={setVariantTypes}
                  />
                </React.Fragment>
              ))}
            </section>
          </>
        )}
        {isErrorVariant && <p className="text-sm text-red-500">Upload foto</p>}
        <hr />
        <ItemVariant
          title="ukuran"
          control={formSize.control}
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
              Pilih warna/jenis/tipe di atas untuk melihat/mengatur ukuran
            </p>
          ) : (
            <>
              {variantTypes
                .filter((f) => f.name === labelAndImage?.label)
                .map((v) =>
                  v.variantColorProduct.map((s, idx) => (
                    <section className="relative" key={idx}>
                      <Btn
                        size="sm"
                        variant="light"
                        className="w-[6rem] border border-gray-400 text-gray-500"
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
          aria-label="atur info variasi"
          className="mx-auto mt-4"
          onClick={() => handleSubmitVariant(fieldName, setValue)}
        />
      </main>
    </Modal>
  );
};
