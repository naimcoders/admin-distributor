import Error from "src/components/Error";
import Image from "src/components/Image";
import Textarea from "src/components/Textarea";
import {
  ArrowUpTrayIcon,
  CheckIcon,
  ChevronRightIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChangeEvent,
  Fragment,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { FieldValues, useForm } from "react-hook-form";
import { ChildRef, File } from "src/components/File";
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
import { Radio, RadioGroup, Switch, Button as Btn } from "@nextui-org/react";
import { Button } from "src/components/Button";
import { XCircleIcon } from "@heroicons/react/24/solid";
import useGeneralStore from "src/stores/generalStore";

const Create = () => {
  const {
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>();
  const { productPhotoRef, onClick, onChange, photos, setPhotos } =
    useUploadPhoto();

  const findAllCategories = useCategory().findAll();
  const { fields } = useFields();

  return (
    <>
      {findAllCategories.error ? (
        <Error error={findAllCategories.error} />
      ) : (
        <main className="flexcol gap-8">
          <header className="flex gap-6 items-center flex-wrap">
            {photos.map((v) => (
              <Image
                src={v}
                alt="Product"
                key={v}
                className="aspect-square w-[10rem] object-cover rounded-md"
                actions={[
                  {
                    src: <TrashIcon width={16} />,
                    onClick: () => setPhotos(photos.filter((e) => e !== v)),
                  },
                ]}
              />
            ))}

            <File
              control={control}
              onClick={onClick}
              onChange={onChange}
              name="productPhoto"
              ref={productPhotoRef}
              placeholder="tambah foto"
              className="w-[10rem]"
              readOnly={{ isValue: true, cursor: "cursor-pointer" }}
              startContent={<PhotoIcon width={16} color={IconColor.zinc} />}
            />
          </header>

          <GridInput className="grid grid-cols-3">
            {fields.map((v) => (
              <Fragment key={v.label}>
                {["text", "rp"].includes(v.type!) && (
                  <Textfield
                    type={v.type}
                    name={v.name}
                    label={v.label}
                    control={control}
                    placeholder={v.placeholder}
                    defaultValue={v.defaultValue}
                    errorMessage={handleErrorMessage(errors, v.name)}
                    rules={{
                      required: { value: true, message: v.errorMessage! },
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
                    name={v.name}
                    label={v.label}
                    control={control}
                    onClick={v.onClick}
                    placeholder={v.placeholder}
                    defaultValue={v.defaultValue}
                    errorMessage={handleErrorMessage(errors, v.name)}
                    readOnly={{ isValue: true, cursor: "cursor-pointer" }}
                    rules={{
                      required: { value: true, message: v.errorMessage! },
                    }}
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

          <Button aria-label="simpan" className="mx-auto mt-5" />

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
                  endContent={
                    <div className={`text-[${IconColor.zinc}] text-sm`}>g</div>
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

const VariantModal = () => {
  const {
    isAddType,
    isDeleteType,
    actionIsVariant,
    control,
    errors,
    handleAddType,
    handleChangeType,
    handleDeleteType,
    handleOnKeyDown,
    handleSubmitType,
    isVariant,
    setFocus,
    variantTypes,
  } = useVariant();

  const fImage = useRef<ChildRef>(null);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e);
  };
  const onClick = () => {
    if (fImage.current) {
      fImage.current.click();
    }
  };

  useEffect(() => {
    if (isAddType) {
      setFocus("type");
    }
  }, [isAddType]);

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
              {!isDeleteType ? "ubah" : "selesai"}
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
                      className="w-[6rem] border border-gray-400 text-gray-500"
                    >
                      {v.label}
                    </Btn>
                    {isDeleteType && (
                      <XCircleIcon
                        width={20}
                        color={IconColor.red}
                        className="absolute -top-2 -right-2 cursor-pointer"
                        title="hapus"
                        onClick={() => handleDeleteType(v.label)}
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
                className="w-[6rem] border border-gray-400 text-gray-500"
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
                control={control}
                onKeyDown={handleOnKeyDown}
                placeholder="masukkan warna"
                errorMessage={handleErrorMessage(errors, "type")}
                rules={{ required: { value: true, message: "masukkan warna" } }}
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

        {/* image */}
        {variantTypes.length > 0 && (
          <>
            <hr />
            <section className="grid grid-cols-3 gap-4">
              {variantTypes.map((v) => (
                <File
                  ref={fImage}
                  name={v.label}
                  control={control}
                  onClick={onClick}
                  onChange={onChange}
                  placeholder={v.label}
                  errorMessage={handleErrorMessage(errors, v.label)}
                  startContent={
                    <ArrowUpTrayIcon width={16} color={IconColor.zinc} />
                  }
                  rules={{ required: { value: true, message: "unggah foto" } }}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </Modal>
  );
};

const useVariant = () => {
  const [isDeleteType, setIsDeleteTye] = useState(false);
  const [isAddType, setIsAddType] = useState(false);

  const {
    control,
    handleSubmit,
    resetField,
    setFocus,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>();

  const { isVariant, actionIsVariant } = useActiveModal();
  const variantTypes = useGeneralStore((v) => v.variantTypes);
  const setVariantType = useGeneralStore((v) => v.setVariantType);

  const handleAddType = () => setIsAddType((v) => !v);
  const handleChangeType = () => setIsDeleteTye((v) => !v);

  const handleSubmitType = handleSubmit(async (e) => {
    try {
      const type = e.type;
      setVariantType([...variantTypes, { label: type }]);
      setFocus("type");
    } catch (e) {
      const error = e as Error;
      console.error(error);
    } finally {
      resetField("type");
    }
  });

  const handleOnKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const type = getValues();
      setVariantType([...variantTypes, { label: type.type }]);

      setFocus("type");
      resetField("type");
      setFocus("type");
    }

    if (e.key === "Escape") {
      setIsAddType((v) => !v);
    }
  };

  const handleDeleteType = (label: string) => {
    const newTypes = variantTypes.filter((type) => type.label !== label);
    setVariantType(newTypes);
  };

  return {
    handleOnKeyDown,
    control,
    errors,
    isVariant,
    actionIsVariant,
    handleDeleteType,
    handleAddType,
    handleChangeType,
    handleSubmitType,
    isDeleteType,
    isAddType,
    setFocus,
    variantTypes,
  };
};

const ModalCategory = ({
  clearErrors,
  setValue,
}: Pick<UseForm, "setValue" | "clearErrors">) => {
  const { isCategory, actionIsCategory, isSubCategory, actionIsSubCategory } =
    useActiveModal();
  // const findAllCategories = useCategory().findAll();

  const categories: string[] = [
    "Makanan & Minuman Siap Saji",
    "Bumbu & Bahan Makanan",
    "Kantor & Alat Tulis",
    "Makanan & Minuman Kemasan",
    "Fashion & Kecantikan",
  ];
  const subCategories: string[] = [
    "Sembako",
    "Bumbu Instan",
    "Daging & Ikan",
    "Sayur Mayur",
    "Bumbu Segar",
  ];

  return (
    <>
      <ListingModal
        title="kategori"
        keyField="category"
        data={categories}
        setValue={setValue}
        clearErrors={clearErrors}
        modal={{
          open: isCategory,
          close: actionIsCategory,
        }}
      />

      <ListingModal
        title="sub kategori"
        keyField="subCategory"
        data={subCategories}
        setValue={setValue}
        clearErrors={clearErrors}
        modal={{
          open: isSubCategory,
          close: actionIsSubCategory,
        }}
      />
    </>
  );
};

const ModalSubDistributor = ({
  clearErrors,
  setValue,
}: Pick<UseForm, "setValue" | "clearErrors">) => {
  const { actionIsSubDistributor, isSubDistributor } = useActiveModal();

  const subDistributors: string[] = [
    "Agung Jaya",
    "Bintang",
    "Arta Boga Cemerlang",
    "Semeru",
    "Ektong",
    "Bintang Terang",
  ];

  return (
    <ListingModal
      title="sub-distributor"
      keyField="subDistributor"
      data={subDistributors}
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
  const [photos, setPhotos] = useState<string[]>([]);
  const productPhotoRef = useRef<ChildRef>(null);

  const onClick = () => {
    if (productPhotoRef.current) productPhotoRef.current.click();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;

    const blob = URL.createObjectURL(e.target.files[0]);
    setPhotos([...photos, blob]);
  };

  return { productPhotoRef, onClick, onChange, photos, setPhotos };
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

  // const formatToRupiah = (value: string) => {
  //   const formatter = new Intl.NumberFormat("id-ID", {
  //     style: "currency",
  //     currency: "IDR",
  //   });
  //   return formatter.format(Number(value.replace(/\D/g, "")));
  // };

  // const handleOnInput = (getValues: UseFormGetValues<FieldValues>, fieldName: string, e: ChangeEvent<HTMLInputElement>) => {
  //   const val= getValues(fieldName)
  //   const rawValue = formatToRupiah(val)

  // }

  const fields: TextfieldProps[] = [
    objectFields({
      label: "nama produk *",
      name: "productName",
      type: "text",
      defaultValue: "",
    }),
    objectFields({
      label: "kategori *",
      name: "category",
      type: "modal",
      defaultValue: "",
      onClick: actionIsCategory,
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
