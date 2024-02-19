import square from "src/assets/images/square.png";
import rectangle from "src/assets/images/rectangle.png";
import cx from "classnames";
import Error from "src/components/Error";
import Image from "src/components/Image";
import Textarea from "src/components/Textarea";
import {
  CheckIcon,
  ChevronRightIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
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
import { FieldValues, useForm } from "react-hook-form";
import { ChildRef, File, FileProps } from "src/components/File";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { CurrencyIDInput, handleErrorMessage } from "src/helpers";
import { IconColor, UseForm } from "src/types";
import { GridInput } from "../Index";
import { useCategory } from "src/api/category.service";
import { ListingModal } from "src/components/Category";
import { useActiveModal } from "src/stores/modalStore";
import { Modal } from "src/components/Modal";
import {
  Radio,
  RadioGroup,
  Switch,
  Button as Btn,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { Button } from "src/components/Button";
import { XCircleIcon } from "@heroicons/react/24/solid";
import useGeneralStore, { VariantTypeProps } from "src/stores/generalStore";

const Create = () => {
  const {
    control,
    setValue,
    clearErrors,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();

  const {
    productPhotoRef,
    onClick,
    onChange,
    photos,
    setPhotos,
    handleProductSize,
    isPopOver,
    setIsPopOver,
  } = useUploadPhoto();

  const findAllCategories = useCategory().findAll();
  const { fields } = useFields();

  const onSubmit = handleSubmit(() => {
    console.log(getValues());
  });

  return (
    <>
      {findAllCategories.error ? (
        <Error error={findAllCategories.error} />
      ) : (
        <main className="flexcol gap-8">
          <header className="flex gap-6 items-center flex-wrap">
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
                    src: <TrashIcon width={16} />,
                    onClick: () => setPhotos(photos.filter((e) => e !== v)),
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
                    <File
                      key={v}
                      control={control}
                      onClick={() => {
                        handleProductSize(v);
                        onClick();
                      }}
                      onChange={onChange}
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
                        />
                      }
                    />
                  ))}
                </section>
              </PopoverContent>
            </Popover>
          </header>

          <GridInput className="grid grid-cols-3">
            {fields.map((v) => (
              <Fragment key={v.label}>
                {["text", "rp", "number"].includes(v.type!) && (
                  <Textfield
                    {...v}
                    type={v.type}
                    control={control}
                    errorMessage={handleErrorMessage(errors, v.name)}
                    rules={{
                      required: v.rules?.required,
                      onBlur: (e) =>
                        CurrencyIDInput({
                          type: v.type!,
                          fieldName: v.name,
                          setValue,
                          value: e.target.value,
                        }),
                    }}
                  />
                )}

                {["modal"].includes(v.type!) && (
                  <Textfield
                    {...v}
                    control={control}
                    rules={v.rules}
                    errorMessage={handleErrorMessage(errors, v.name)}
                    readOnly={{ isValue: true, cursor: "cursor-pointer" }}
                    endContent={
                      <ChevronRightIcon width={16} color={IconColor.zinc} />
                    }
                  />
                )}
              </Fragment>
            ))}
          </GridInput>

          <GridInput className="grid grid-cols-3">
            <Textarea
              label="deskripsi"
              name="description"
              defaultValue=""
              control={control}
              placeholder="masukkan deskripsi"
            />
          </GridInput>

          <Button
            aria-label="simpan"
            className="mx-auto mt-5"
            onClick={onSubmit}
          />

          <ModalCategory setValue={setValue} clearErrors={clearErrors} />
          <DangerousModal setValue={setValue} />
          <ConditionModal setValue={setValue} />
          <PostageModal />
          <VariantModal />
          <ModalSubDistributor setValue={setValue} clearErrors={clearErrors} />
        </main>
      )}
    </>
  );
};

const VariantModal = () => {
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
  } = useVariant();

  const [isVariantPhoto, setIsVariantPhoto] = useState(true);
  const [labelProduct, setLabelProduct] = useState("");

  const { productPhotoRef } = useUploadPhoto();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;
    const files = e.target.files[0];
    const blob = URL.createObjectURL(files);

    const [datas] = variantTypes.filter((f) => f.label === labelProduct);
    datas.image = blob;

    let setImageValueToArr: VariantTypeProps[] = [];
    variantTypes.forEach((e) => {
      if (e.label === labelProduct) {
        setImageValueToArr.push(datas);
      }

      if (e.label !== labelProduct) {
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

  const variantSize = useGeneralStore((v) => v.variantSize);

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
                        labelAndImage?.label === v.label &&
                          "border border-blue-800"
                      )}
                      onClick={() => onClickType(v.label ?? "")}
                    >
                      {v.label}
                    </Btn>
                    {isDeleteType && (
                      <XCircleIcon
                        width={20}
                        color={IconColor.red}
                        className="absolute -top-2 -right-2 cursor-pointer"
                        title="hapus"
                        onClick={() => handleDeleteType(v.label ?? "")}
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
                    label={v.label ?? ""}
                    image={v.image ?? ""}
                    onClick={() => onClick(v.label ?? "")}
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
              <section className="flex gap-3 flex-wrap">
                {variantSize
                  .filter((f) => f.label === labelAndImage?.label)
                  .map((v, idx) => (
                    <section className="relative" key={idx}>
                      <Btn
                        size="sm"
                        variant="light"
                        className="w-[6rem] border border-gray-400 text-gray-500"
                      >
                        {v.size}
                      </Btn>
                      {isDeleteSize && (
                        <XCircleIcon
                          width={20}
                          color={IconColor.red}
                          className="absolute -top-2 -right-2 cursor-pointer"
                          title="hapus"
                          onClick={() => handleDeleteSize(v.size ?? "")}
                        />
                      )}
                    </section>
                  ))}

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

        <Button aria-label="atur info variasi" className="mx-auto mt-4" />
      </main>
    </Modal>
  );
};

const useVariant = () => {
  const formType = useForm<FieldValues>();
  const formSize = useForm<FieldValues>();

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

  const handleSubmitType = formType.handleSubmit(async (e) => {
    try {
      const type = e.type;
      setVariantType([...variantTypes, { label: type }]);
      formType.setFocus("type");
    } catch (e) {
      const error = e as Error;
      console.error(error);
    } finally {
      formType.resetField("type");
    }
  });

  const variantSize = useGeneralStore((v) => v.variantSize);
  const setVariantSize = useGeneralStore((v) => v.setVariantSize);

  const handleSubmitSize = formSize.handleSubmit(async (e) => {
    try {
      const val = e.size;

      setVariantSize([
        ...variantSize,
        { label: labelAndImage?.label, size: val },
      ]);

      formSize.setFocus("size");
    } catch (e) {
      const error = e as Error;
      console.error(error);
    } finally {
      formSize.resetField("size");
    }
  });

  const handleOnKeyDownType = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const type = formType.getValues();
      setVariantType([...variantTypes, { label: type.type }]);

      formType.setFocus("type");
      formType.resetField("type");
      formType.setFocus("type");
    }

    if (e.key === "Escape") {
      setIsAddType((v) => !v);
    }
  };

  const handleOnKeyDownSize = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const size = formSize.getValues();
      setVariantSize([
        ...variantSize,
        { label: labelAndImage?.label, size: size.size },
      ]);

      formSize.setFocus("size");
      formSize.resetField("size");
    }

    if (e.key === "Escape") {
      setIsAddSize((v) => !v);
    }
  };

  const handleDeleteType = (label: string) => {
    const newTypes = variantTypes.filter((type) => type.label !== label);
    setVariantType(newTypes);
  };

  const handleDeleteSize = (size: string) => {
    const newTypes = variantSize.filter((type) => type.size !== size);
    setVariantSize(newTypes);
  };

  return {
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
      const [byLabel] = variantTypes.filter((f) => f.label === props.label);

      byLabel.image = "";

      const currentValues: VariantTypeProps[] = [];

      variantTypes.forEach((e) => {
        if (e.label === props.label) {
          currentValues.push(byLabel);
        }
        if (e.label !== props.label) {
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

const PostageModal = () => {
  const { isPostage, actionIsPostage } = useActiveModal();
  const { packageSize, outOfTownDeliveryField } = usePostage();
  const [isOutOfTown, setIsOutOfTown] = useState(false);

  const {
    control,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>();

  const handleSwitchOutOfTown = () => setIsOutOfTown((v) => !v);

  return (
    <Modal isOpen={isPostage} closeModal={actionIsPostage}>
      <section className="my-2 flexcol gap-4">
        <Textfield
          name="weight"
          placeholder="atur berat produk"
          label="berat produk"
          control={control}
          defaultValue=""
          errorMessage={handleErrorMessage(errors, "postage")}
          endContent={
            <div className={`text-[${IconColor.zinc}] text-sm`}>g</div>
          }
          rules={{
            required: { value: true, message: "masukkan berat produk" },
            onBlur: (e) =>
              CurrencyIDInput({
                type: "rp",
                fieldName: "weight",
                setValue,
                value: e.target.value,
              }),
          }}
        />

        <hr />

        <section>
          <h2 className="font-semibold capitalize">ukuran paket</h2>
          <section className="flexcol gap-4 mt-4">
            {packageSize.map((v) => (
              <Textfield
                key={v.label}
                name={v.name}
                label={v.label}
                control={control}
                placeholder={v.placeholder}
                defaultValue={v.defaultValue}
                errorMessage={handleErrorMessage(errors, v.name)}
                endContent={
                  <div className={`text-[${IconColor.zinc}] text-sm`}>cm</div>
                }
                rules={{
                  required: { value: true, message: v.errorMessage! },
                  onBlur: (e) =>
                    CurrencyIDInput({
                      type: "rp",
                      setValue,
                      fieldName: v.name,
                      value: e.target.value,
                    }),
                }}
              />
            ))}
          </section>
        </section>

        <hr />

        <section>
          <h2 className="font-semibold capitalize mb-4">
            pengiriman dalam kota
          </h2>
          <Textfield
            name="postage"
            label="kurir distributor"
            placeholder="atur ongkir"
            control={control}
            defaultValue=""
            type="number"
            startContent={
              <div className={`text-[${IconColor.zinc}] text-sm`}>Rp</div>
            }
            errorMessage={handleErrorMessage(errors, "postage")}
            rules={{
              required: { value: true, message: "masukkan berat produk" },
              onBlur: (e) =>
                CurrencyIDInput({
                  type: "rp",
                  fieldName: "postage",
                  setValue,
                  value: e.target.value,
                }),
            }}
          />
        </section>

        <hr />
        <section>
          <header className="flex justify-between">
            <h2 className="font-semibold capitalize">pengiriman luar kota</h2>
            <Switch
              size="sm"
              isSelected={isOutOfTown}
              color="success"
              onClick={handleSwitchOutOfTown}
            />
          </header>
          {isOutOfTown && (
            <section className="mt-4 flexcol gap-4">
              {outOfTownDeliveryField.map((v) => (
                <Textfield
                  key={v.label}
                  name={v.name}
                  label={v.label}
                  control={control}
                  readOnly={v.readOnly}
                  description={v.description}
                  defaultValue={v.defaultValue}
                  startContent={
                    <div className={`text-[${IconColor.zinc}] text-sm`}>Rp</div>
                  }
                />
              ))}
            </section>
          )}
        </section>

        <Button aria-label="simpan" className="mx-auto mt-4" />
      </section>
    </Modal>
  );
};

const usePostage = () => {
  const packageSize: TextfieldProps[] = [
    objectFields({
      name: "width",
      label: "lebar",
      placeholder: "atur lebar",
      defaultValue: "",
    }),
    objectFields({
      name: "length",
      label: "panjang",
      defaultValue: "",
      placeholder: "atur panjang",
    }),
    objectFields({
      name: "height",
      label: "tinggi",
      defaultValue: "",
      placeholder: "atur tinggi",
    }),
  ];

  const outOfTownDeliveryField: TextfieldProps[] = [
    objectFields({
      name: "jneReguler",
      defaultValue: "30.000",
      label: "JNE Reguler",
      description: "maks 50.000 g",
      readOnly: { isValue: true, cursor: "cursor-pointer" },
    }),
    objectFields({
      name: "jneCargo",
      defaultValue: "35.000",
      label: "JNE Cargo",
      description: "maks 50.000 g",
      readOnly: { isValue: true, cursor: "cursor-pointer" },
    }),
  ];

  return { packageSize, outOfTownDeliveryField };
};

const ModalCategory = ({
  clearErrors,
  setValue,
}: Pick<UseForm, "setValue" | "clearErrors">) => {
  const { isCategory, actionIsCategory } = useActiveModal();

  const categories = useCategory().findAll();

  // const categories: string[] = [
  //   "Makanan & Minuman Siap Saji",
  //   "Bumbu & Bahan Makanan",
  //   "Kantor & Alat Tulis",
  //   "Makanan & Minuman Kemasan",
  //   "Fashion & Kecantikan",
  // ];
  // const subCategories: string[] = [
  //   "Sembako",
  //   "Bumbu Instan",
  //   "Daging & Ikan",
  //   "Sayur Mayur",
  //   "Bumbu Segar",
  // ];

  const sortCategories = categories.data?.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <>
      <ListingModal
        title="kategori"
        keyField="category"
        data={sortCategories}
        setValue={setValue}
        clearErrors={clearErrors}
        modal={{
          open: isCategory,
          close: actionIsCategory,
        }}
      />

      {/* <ListingModal
        title="sub kategori"
        keyField="subCategory"
        data={subCategories}
        setValue={setValue}
        clearErrors={clearErrors}
        modal={{
          open: isSubCategory,
          close: actionIsSubCategory,
        }}
      /> */}
    </>
  );
};

const ModalSubDistributor = ({
  clearErrors,
  setValue,
}: Pick<UseForm, "setValue" | "clearErrors">) => {
  const { actionIsSubDistributor, isSubDistributor } = useActiveModal();
  // const subDistributors: string[] = [
  //   "Agung Jaya",
  //   "Bintang",
  //   "Arta Boga Cemerlang",
  //   "Semeru",
  //   "Ektong",
  //   "Bintang Terang",
  // ];

  return (
    <ListingModal
      title="sub-distributor"
      keyField="subDistributor"
      data={[]}
      setValue={setValue}
      clearErrors={clearErrors}
      modal={{
        open: isSubDistributor,
        close: actionIsSubDistributor,
      }}
    />
  );
};

const useUploadPhoto = () => {
  const [isPopOver, setIsPopOver] = useState(false);
  const [photos, setPhotos] = useState<{ src: string; size: string }[]>([]);
  const [productSize, setProductSize] = useState("1:1");
  const productPhotoRef = useRef<ChildRef>(null);

  const handleProductSize = (size: string) => setProductSize(size);

  const onClick = () => {
    if (productPhotoRef.current) {
      productPhotoRef.current.click();
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;

    const blob = URL.createObjectURL(e.target.files[0]);
    setPhotos([...photos, { src: blob, size: productSize }]);
    setIsPopOver((v) => !v);
  };

  return {
    productPhotoRef,
    onClick,
    onChange,
    photos,
    setPhotos,
    handleProductSize,
    isPopOver,
    setIsPopOver,
  };
};

const DangerousModal = (p: Pick<UseForm, "setValue">) => {
  const { isDangerous, actionIsDangerous } = useActiveModal();
  const [isStatus, setIsStatus] = useState(false);

  useEffect(() => {
    p.setValue("dangerous", isStatus ? "Ya" : "Tidak");
  }, [isStatus]);

  return (
    <Modal isOpen={isDangerous} closeModal={actionIsDangerous}>
      <section className="my-4 flexcol gap-5">
        <h1>Mengandung baterai/magnet/cairan/bahan mudah terbakar</h1>
        <Switch
          color="success"
          id="switch"
          name="switch"
          size="sm"
          isSelected={isStatus}
          onValueChange={setIsStatus}
        >
          {isStatus ? "Ya" : "Tidak"}
        </Switch>
      </section>
    </Modal>
  );
};

const ConditionModal = (p: Pick<UseForm, "setValue">) => {
  const { isCondition, actionIsCondition } = useActiveModal();
  return (
    <Modal title="kondisi" isOpen={isCondition} closeModal={actionIsCondition}>
      <RadioGroup
        color="primary"
        defaultValue="Baru"
        size="sm"
        className="mt-4"
        onValueChange={(val) => p.setValue("condition", val)}
      >
        <Radio value="Baru">Baru</Radio>
        <Radio value="Pernah Dipakai">Pernah Dipakai</Radio>
      </RadioGroup>
    </Modal>
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
  } = useActiveModal();

  const fields: TextfieldProps[] = [
    objectFields({
      label: "nama produk *",
      name: "productName",
      type: "text",
      defaultValue: "",
      rules: { required: { value: true, message: "Masukkan nama produk" } },
    }),
    objectFields({
      label: "kategori *",
      name: "category",
      type: "modal",
      defaultValue: "",
      onClick: actionIsCategory,
      rules: { required: { value: true, message: "Pilih kategori" } },
    }),
    objectFields({
      label: "sub-kategori",
      name: "subCategory",
      type: "modal",
      defaultValue: "",
      onClick: actionIsSubCategory,
    }),
    objectFields({
      label: "produk berbahaya",
      name: "dangerous",
      type: "modal",
      defaultValue: "Tidak",
      onClick: actionIsDangerous,
    }),
    objectFields({
      label: "variasi",
      name: "variant",
      type: "modal",
      defaultValue: "",
      placeholder: "tentukan variasi",
      onClick: actionIsVariant,
    }),
    objectFields({
      label: "harga (Rp) *",
      name: "price",
      type: "rp",
      placeholder: "masukkan harga",
      defaultValue: "",
    }),
    objectFields({
      label: "ongkos kirim (berat/ukuran) *",
      name: "postage",
      type: "modal",
      defaultValue: "",
      placeholder: "masukkan ongkos kirim",
      onClick: actionIsPostage,
    }),
    objectFields({
      label: "kondisi *",
      name: "condition",
      type: "modal",
      defaultValue: "Baru",
      onClick: actionIsCondition,
    }),
    objectFields({
      label: "sub-distributor",
      name: "subDistributor",
      type: "modal",
      defaultValue: "",
      onClick: actionIsSubDistributor,
    }),
    objectFields({
      label: "deskripsi produk",
      name: "description",
      type: "textarea",
      defaultValue: "",
    }),
  ];

  return { fields };
};

export default Create;
