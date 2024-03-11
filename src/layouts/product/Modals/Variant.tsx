import cx from "classnames";
import { Button as Btn, Switch } from "@nextui-org/react";
import {
  ChangeEvent,
  FC,
  Fragment,
  KeyboardEvent,
  useEffect,
  useState,
} from "react";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import useGeneralStore, { VariantTypeProps } from "src/stores/generalStore";
import { IconColor, UseForm } from "src/types";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useActiveModal } from "src/stores/modalStore";
import { FieldValues, useForm } from "react-hook-form";
import { useUploadProduct } from "../Create";
import { ItemVariant } from "src/components/VariantItem";
import VariantImage from "src/components/ImageVariant";

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

  useEffect(() => {
    if (isAddType) formType.setFocus("type");
    if (isAddSize) formSize.setFocus("size");
  }, [isAddType, isAddSize]);

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
                    onClick={() => handleDeleteType(v.name ?? "")}
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
                <Fragment key={k}>
                  <VariantImage
                    label={v.name ?? ""}
                    image={v.imageUrl ?? ""}
                    onClick={() => onClick(v.name ?? "")}
                    onChange={onChange}
                    ref={productPhotoRef}
                  />
                </Fragment>
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
              Pilih warna/jenis/tipe di atas untuk mengatur ukuran
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
                          onClick={() => handleDeleteSize(s.name)}
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

interface LabelAndImageProps {
  label?: string;
  image?: string;
  size?: { label?: string; price?: string }[];
}

interface UseVariantProps {
  variantTypes: VariantTypeProps[];
  setVariantTypes: (v: VariantTypeProps[]) => void;
}

export const useVariant = ({
  variantTypes,
  setVariantTypes,
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

  const handleSubmitVariant = (
    fieldName: string,
    setValue: Pick<UseForm, "setValue">["setValue"]
  ) => {
    let error = 0;
    variantTypes.forEach((e) => {
      if (isVariantPhoto && !e.imageUrl) error++;
    });

    if (error > 0) setIsErrorVariant(true);
    else {
      const value = variantTypes.map((m) => m.name).join(", ");
      console.log(value, variantTypes);
      setValue(fieldName, value);
      actionIsVariant();
      setTimeout(actionIsPrice, 500);
    }
  };

  const handleSubmitType = formType.handleSubmit((e) => {
    const type = e.type;
    setVariantTypes([...variantTypes, { name: type, variantColorProduct: [] }]);
    formType.setFocus("type");
    formType.resetField("type");
  });

  const handleSubmitSize = formSize.handleSubmit((e) => {
    const val = e.size;
    const [typeByName] = variantTypes.filter(
      (type) => type.name === labelAndImage?.label
    );
    typeByName.variantColorProduct.push({ name: val });
    formSize.setFocus("size");
    formSize.resetField("size");
  });

  const handleOnKeyDownSize = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = formSize.getValues().size;
      const [typeByName] = variantTypes.filter(
        (type) => type.name === labelAndImage?.label
      );
      typeByName.variantColorProduct.push({ name: val });
      formSize.setFocus("size");
      formSize.resetField("size");
    }
    if (e.key === "Escape") setIsAddSize((v) => !v);
  };

  const handleOnKeyDownType = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const type = formType.getValues();
      setVariantTypes([
        ...variantTypes,
        { name: type.type, variantColorProduct: [] },
      ]);
      formType.setFocus("type");
      formType.resetField("type");
      formType.setFocus("type");
    }
    if (e.key === "Escape") setIsAddType((v) => !v);
  };

  const handleDeleteType = (label: string) => {
    const newTypes = variantTypes.filter((type) => type.name !== label);
    setVariantTypes(newTypes);
  };

  const handleDeleteSize = (val: string) => {
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
