import Image from "src/components/Image";
import cx from "classnames";
import { Button as Btn, Switch } from "@nextui-org/react";
import {
  ChangeEvent,
  Fragment,
  KeyboardEvent,
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import useGeneralStore, { VariantTypeProps } from "src/stores/generalStore";
import { IconColor } from "src/types";
import {
  CheckIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { Textfield } from "src/components/Textfield";
import { handleErrorMessage } from "src/helpers";
import { ChildRef, FileProps } from "src/components/File";
import { useActiveModal } from "src/stores/modalStore";
import { FieldValues, useForm } from "react-hook-form";
import { useUploadProduct } from "../Create";

export const VariantModal = () => {
  const {
    isAddType,
    isDeleteType,
    actionIsVariant,
    handleAddType,
    handleChangeType,
    handleDeleteType,
    handleSubmitType,
    isVariant,
    variantTypes,
    setVariantType,
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
    size,
  } = useVariant();

  const [isVariantPhoto, setIsVariantPhoto] = useState(true);
  const [labelProduct, setLabelProduct] = useState("");

  const { productPhotoRef } = useUploadProduct();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;
    const files = e.target.files[0];
    const blob = URL.createObjectURL(files);

    const [datas] = variantTypes.filter((f) => f.name === labelProduct);
    datas.imageUrl = blob;

    let setImageValueToArr: VariantTypeProps[] = [];
    variantTypes.forEach((e) => {
      if (e.name === labelProduct) {
        setImageValueToArr.push(datas);
      }

      if (e.name !== labelProduct) {
        setImageValueToArr.push(e);
      }
    });

    setVariantType([...setImageValueToArr]);
  };

  const onClick = (label: string) => {
    if (productPhotoRef.current) {
      productPhotoRef.current.click();
      setLabelProduct(label);
    }
  };

  const onClickType = (label: string) => {
    setLabelAndImage({ label });
  };

  useEffect(() => {
    if (isAddType) formType.setFocus("type");
    if (isAddSize) formSize.setFocus("size");
  }, [isAddType, isAddSize]);

  return (
    <Modal isOpen={isVariant} closeModal={actionIsVariant}>
      <main className="my-4 flexcol gap-6">
        <header className="flexcol gap-2">
          <section className="flex items-center justify-between">
            <h2 className="font-semibold capitalize">warna/jenis/tipe</h2>
            <button
              className={`text-[${IconColor.red}] text-sm capitalize`}
              title="edit"
              onClick={handleChangeType}
            >
              {!isDeleteType ? "edit" : "selesai"}
            </button>
          </section>

          <section className="flexcol gap-2">
            <section className="flex gap-3 flex-wrap">
              {variantTypes.length > 0 &&
                variantTypes.map((v, idx) => (
                  <section className="relative" key={idx}>
                    <Btn
                      size="sm"
                      variant="light"
                      className={cx(
                        "w-[6rem] border border-gray-300 text-gray-500",
                        labelAndImage?.label === v.name &&
                          "border border-blue-800"
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

              <Button
                aria-label={!isAddType ? "tambah" : "batal"}
                endContent={
                  !isAddType ? (
                    <PlusIcon width={16} />
                  ) : (
                    <XMarkIcon width={16} />
                  )
                }
                className="w-[6rem] border border-gray-300 text-gray-500"
                color="default"
                variant="light"
                size="sm"
                onClick={handleAddType}
              />
            </section>

            {isAddType && (
              <Textfield
                name="type"
                defaultValue=""
                control={formType.control}
                onKeyDown={handleOnKeyDownType}
                placeholder="masukkan warna/jenis/tipe"
                errorMessage={handleErrorMessage(
                  formType.formState.errors,
                  "type"
                )}
                rules={{
                  required: {
                    value: true,
                    message: "masukkan warna/jenis/tipe",
                  },
                }}
                endContent={
                  <CheckIcon
                    width={16}
                    title="Tambah"
                    className="cursor-pointer"
                    onClick={handleSubmitType}
                  />
                }
              />
            )}
          </section>
        </header>
        <hr />

        <section className="flex justify-between">
          <section>
            <h2>Tambah foto ke variasi "Warna/Jenis/Tipe"</h2>
            <p className={`text-sm text-[${IconColor.zinc}]`}>
              Semua foto harus diupload apabila diaktifkan
            </p>
          </section>
          <Switch
            color="success"
            size="sm"
            isSelected={isVariantPhoto}
            onClick={() => setIsVariantPhoto((v) => !v)}
          />
        </section>

        {isVariantPhoto && variantTypes.length > 0 && (
          <>
            <section className="grid grid-cols-3 gap-2">
              {variantTypes.map((v, idx) => (
                <Fragment key={idx}>
                  <VariantFileImage
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

        <hr />
        {/* footer */}
        <footer className="flexcol gap-2">
          <section className="flex items-center justify-between">
            <h2 className="font-semibold capitalize">ukuran</h2>
            <button
              className={`text-[${IconColor.red}] text-sm capitalize`}
              title="edit"
              onClick={handleChangeSize}
            >
              {!isDeleteSize ? "edit" : "selesai"}
            </button>
          </section>

          {!labelAndImage?.label ? (
            <p className={`text-sm text-[${IconColor.zinc}]`}>
              Pilih warna/jenis/tipe di atas untuk mengatur ukuran
            </p>
          ) : (
            <section className="flexcol gap-2">
              {/* <section className="flex gap-3 flex-wrap">
                {variantSize
                  .filter((f) => f.label === labelAndImage?.label)
                  .map((v) =>
                    v.size?.map((s, idx) => (
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
                            onClick={() => handleDeleteSize(s.name ?? "")}
                          />
                        )}
                      </section>
                    ))
                  )}

                <Button
                  aria-label={!isAddSize ? "tambah" : "batal"}
                  endContent={
                    !isAddSize ? (
                      <PlusIcon width={16} />
                    ) : (
                      <XMarkIcon width={16} />
                    )
                  }
                  className="w-[6rem] border border-gray-400 text-gray-500"
                  color="default"
                  variant="light"
                  size="sm"
                  onClick={handleAddSize}
                />
              </section> */}

              <section className="flex gap-3 flex-wrap">
                {size
                  .filter((f) => f.label === labelAndImage?.label)
                  .map((v) =>
                    v.size.map((s, idx) => (
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

                <Button
                  aria-label={!isAddSize ? "tambah" : "batal"}
                  endContent={
                    !isAddSize ? (
                      <PlusIcon width={16} />
                    ) : (
                      <XMarkIcon width={16} />
                    )
                  }
                  className="w-[6rem] border border-gray-400 text-gray-500"
                  color="default"
                  variant="light"
                  size="sm"
                  onClick={handleAddSize}
                />
              </section>

              {isAddSize && (
                <Textfield
                  name="size"
                  defaultValue=""
                  control={formSize.control}
                  onKeyDown={handleOnKeyDownSize}
                  placeholder="masukkan size"
                  errorMessage={handleErrorMessage(
                    formSize.formState.errors,
                    "size"
                  )}
                  rules={{
                    required: {
                      value: true,
                      message: "masukkan ukuran",
                    },
                  }}
                  endContent={
                    <CheckIcon
                      width={16}
                      title="Tambah"
                      className="cursor-pointer"
                      onClick={handleSubmitSize}
                    />
                  }
                />
              )}
            </section>
          )}
        </footer>

        <Button
          aria-label="atur info variasi"
          className="mx-auto mt-4"
          onClick={handleSubmitVariant}
        />
      </main>
    </Modal>
  );
};

const useVariant = () => {
  const formType = useForm<FieldValues>();
  const formSize = useForm<FieldValues>();

  const [size, setSize] = useState<
    { label: string; size: { name: string }[] }[]
  >([]);

  const [isDeleteType, setIsDeleteTye] = useState(false);
  const [isDeleteSize, setIsDeleteSize] = useState(false);
  const [isAddType, setIsAddType] = useState(false);
  const [isAddSize, setIsAddSize] = useState(false);
  const [labelAndImage, setLabelAndImage] = useState<{
    label?: string;
    image?: string;
    size?: { label?: string; price?: string }[];
  }>();

  const { isVariant, actionIsVariant } = useActiveModal();
  const variantTypes = useGeneralStore((v) => v.variantTypes);
  const setVariantType = useGeneralStore((v) => v.setVariantType);

  const handleAddType = () => setIsAddType((v) => !v);
  const handleAddSize = () => setIsAddSize((v) => !v);
  const handleChangeType = () => setIsDeleteTye((v) => !v);
  const handleChangeSize = () => setIsDeleteSize((v) => !v);

  const handleSubmitVariant = () => {
    variantTypes.forEach((type) => {
      const [filterByLabel] = size.filter((f) => f.label === type.name);
      const [filterByLabelType] = variantTypes.filter(
        (f) => f.name === type.name
      );
      filterByLabelType.variantColorProduct = filterByLabel?.size ?? null;
    });
    actionIsVariant();
  };

  const handleSubmitType = formType.handleSubmit(async (e) => {
    try {
      const type = e.type;
      setVariantType([...variantTypes, { name: type }]);
      formType.setFocus("type");
    } catch (e) {
      const error = e as Error;
      console.error(error);
    } finally {
      formType.resetField("type");
    }
  });

  const handleSubmitSize = formSize.handleSubmit(async (e) => {
    try {
      const val = e.size;

      const [filter] = size.filter((f) => f.label === labelAndImage?.label);
      const fixedSize = filter?.size ?? [];
      const notSameLabel = size.filter((f) => f.label !== labelAndImage?.label);

      setSize([
        ...notSameLabel,
        {
          label: labelAndImage?.label ?? "",
          size: [
            ...fixedSize,
            {
              name: val,
            },
          ],
        },
      ]);

      formSize.setFocus("size");
    } catch (e) {
      const error = e as Error;
      console.error(error);
    } finally {
      formSize.resetField("size");
    }
  });

  const handleOnKeyDownSize = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = formSize.getValues().size;

      const [filter] = size.filter((f) => f.label === labelAndImage?.label);
      const fixedSize = filter?.size ?? [];
      const notSameLabel = size.filter((f) => f.label !== labelAndImage?.label);

      setSize([
        ...notSameLabel,
        {
          label: labelAndImage?.label ?? "",
          size: [
            ...fixedSize,
            {
              name: val,
            },
          ],
        },
      ]);

      formSize.setFocus("size");
      formSize.resetField("size");
    }

    if (e.key === "Escape") {
      setIsAddSize((v) => !v);
    }
  };

  const handleOnKeyDownType = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const type = formType.getValues();
      setVariantType([...variantTypes, { name: type.type }]);

      formType.setFocus("type");
      formType.resetField("type");
      formType.setFocus("type");
    }

    if (e.key === "Escape") {
      setIsAddType((v) => !v);
    }
  };

  const handleDeleteSize = (val: string) => {
    const [newSize] = size.filter((f) => f.label === labelAndImage?.label);
    const filterOtherLabel = size.filter(
      (f) => f.label !== labelAndImage?.label
    );
    const removeSize = newSize.size.filter((f) => f.name !== val);

    setSize([
      ...filterOtherLabel,
      { label: labelAndImage?.label ?? "", size: removeSize },
    ]);
  };

  const handleDeleteType = (label: string) => {
    const newTypes = variantTypes.filter((type) => type.name !== label);
    setVariantType(newTypes);
  };

  return {
    handleSubmitVariant,
    size,
    setSize,
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
    variantTypes,
    setVariantType,
    isAddSize,
    handleAddSize,
    formSize,
  };
};

const VariantFileImage = forwardRef(
  (
    props: Partial<FileProps> & { label: string; image: string },
    ref: Ref<ChildRef>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      click: () => {
        if (inputRef.current) {
          inputRef.current.click();
        }
      },
    }));

    const variantTypes = useGeneralStore((v) => v.variantTypes);
    const setVariantTypes = useGeneralStore((v) => v.setVariantType);

    const handleDeleteProductImage = () => {
      const [byLabel] = variantTypes.filter((f) => f.name === props.label);

      byLabel.imageUrl = "";

      const currentValues: VariantTypeProps[] = [];

      variantTypes.forEach((e) => {
        if (e.name === props.label) {
          currentValues.push(byLabel);
        }
        if (e.name !== props.label) {
          currentValues.push(e);
        }
      });

      setVariantTypes(currentValues);
    };

    return (
      <>
        <input
          type="file"
          ref={inputRef}
          className="hidden"
          onChange={props.onChange}
        />

        <section
          className={cx(!props.image ? "cursor-pointer" : "cursor-default")}
          onClick={!props.image ? props.onClick : undefined}
        >
          {!props.image ? (
            <section className="flex gap-2 border aspect-square border-dashed border-gray-400 p-2 rounded-tl-md rounded-tr-md items-center">
              <PlusIcon width={16} color={IconColor.zinc} />
              <p className={`capitalize text-sm text-[${IconColor.zinc}]`}>
                tambah foto/video
              </p>
            </section>
          ) : (
            <Image
              radius="none"
              src={props.image}
              className="rounded-tl-md rounded-tr-md aspect-square object-cover border border-gray-400"
              actions={[
                {
                  src: <TrashIcon width={16} color={IconColor.red} />,
                  onClick: handleDeleteProductImage,
                },
              ]}
            />
          )}
          <p
            className={cx(
              `text-sm text-[${IconColor.zinc}] text-center border border-gray-400 rounded-br-md rounded-bl-md py-1`,
              !props.image ? "border-dashed" : "border-solid"
            )}
          >
            {props.label}
          </p>
        </section>
      </>
    );
  }
);
