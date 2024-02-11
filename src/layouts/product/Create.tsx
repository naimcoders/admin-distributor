import {
  ChevronRightIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ChangeEvent, Fragment, useEffect, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { ChildRef, File } from "src/components/File";
import Image from "src/components/Image";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { handleErrorMessage } from "src/helpers";
import { IconColor, UseForm } from "src/types";
import { GridInput } from "../Index";
import { useCategory } from "src/api/category.service";
import Error from "src/components/Error";
import { ListingModal } from "src/components/Category";
import { useActiveModal } from "src/stores/modalStore";
import { Modal } from "src/components/Modal";
import { Radio, RadioGroup, Switch } from "@nextui-org/react";
import Textarea from "src/components/Textarea";
import { Button } from "src/components/Button";

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
          <section className="flex gap-6 items-center flex-wrap">
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
          </section>

          <GridInput className="grid grid-cols-3">
            {fields.map((v) => (
              <Fragment key={v.label}>
                {["text", "number"].includes(v.type!) && (
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

          <ModalCategory setValue={setValue} clearErrors={clearErrors} />
          <DangerousModal setValue={setValue} />
          <ConditionModal setValue={setValue} />
          <PostageModal />
        </main>
      )}
    </>
  );
};

const ModalCategory = ({
  clearErrors,
  setValue,
}: Pick<UseForm, "setValue" | "clearErrors">) => {
  const { isCategory, actionIsCategory, isSubCategory, actionIsSubCategory } =
    useActiveModal();
  const findAllCategories = useCategory().findAll();

  return (
    <>
      <ListingModal
        title="kategori"
        keyField="category"
        data={findAllCategories.data}
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
        data={findAllCategories.data}
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

const PostageModal = () => {
  const { isPostage, actionIsPostage } = useActiveModal();
  const { packageSize, outOfTownDeliveryField } = usePostage();

  const {
    control,
    formState: { errors },
  } = useForm<FieldValues>();

  return (
    <Modal isOpen={isPostage} closeModal={actionIsPostage}>
      <section className="my-2 flexcol gap-4">
        <Textfield
          name="weight"
          placeholder="atur berat produk"
          label="berat produk"
          control={control}
          defaultValue=""
          type="number"
          endContent={
            <div className={`text-[${IconColor.zinc}] text-sm`}>g</div>
          }
          errorMessage={handleErrorMessage(errors, "postage")}
          rules={{
            required: { value: true, message: "masukkan berat produk" },
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
                type={v.type}
                label={v.label}
                control={control}
                placeholder={v.placeholder}
                defaultValue={v.defaultValue}
                errorMessage={handleErrorMessage(errors, v.name)}
                rules={{
                  required: { value: true, message: v.errorMessage! },
                }}
                endContent={
                  <div className={`text-[${IconColor.zinc}] text-sm`}>cm</div>
                }
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
            name="distributorCourier"
            label="kurir distributor"
            placeholder="atur ongkir"
            control={control}
            defaultValue=""
            type="number"
            startContent={
              <div className={`text-[${IconColor.zinc}] text-sm`}>Rp</div>
            }
            errorMessage={handleErrorMessage(errors, "distributorCourier")}
            rules={{
              required: { value: true, message: "masukkan berat produk" },
            }}
          />
        </section>

        <hr />

        <section>
          <header className="flex justify-between">
            <h2 className="font-semibold capitalize">pengiriman luar kota</h2>
            <Switch size="sm" color="success" />
          </header>
          <section className="mt-4 flexcol gap-4">
            {outOfTownDeliveryField.map((v) => (
              <Textfield
                type="text"
                key={v.label}
                name={v.name}
                label={v.label}
                control={control}
                placeholder={v.placeholder}
                defaultValue={v.defaultValue}
                readOnly={v.readOnly}
                startContent={
                  <div className={`text-[${IconColor.zinc}] text-sm`}>Maks</div>
                }
                endContent={
                  <div className={`text-[${IconColor.zinc}] text-sm`}>g</div>
                }
                errorMessage={handleErrorMessage(errors, "postage")}
                rules={{
                  required: { value: true, message: "masukkan berat produk" },
                }}
              />
            ))}
          </section>
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
      type: "number",
      placeholder: "atur lebar",
      defaultValue: "",
    }),
    objectFields({
      name: "length",
      label: "panjang",
      type: "number",
      defaultValue: "",
      placeholder: "atur panjang",
    }),
    objectFields({
      name: "height",
      label: "tinggi",
      type: "number",
      defaultValue: "",
      placeholder: "atur tinggi",
    }),
  ];

  const outOfTownDeliveryField: TextfieldProps[] = [
    objectFields({
      name: "jneReguler",
      defaultValue: "50.000",
      label: "JNE Reguler",
      readOnly: { isValue: true, cursor: "cursor-pointer" },
    }),
    objectFields({
      name: "jneCargo",
      defaultValue: "50.000",
      label: "JNE Cargo",
      readOnly: { isValue: true, cursor: "cursor-pointer" },
    }),
  ];

  return { packageSize, outOfTownDeliveryField };
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
  } = useActiveModal();

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
      label: "harga (Rp) *",
      name: "price",
      type: "number",
      defaultValue: "",
    }),
    objectFields({
      label: "ongkos kirim (berat/ukuran)",
      name: "postage",
      type: "modal",
      defaultValue: "",
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
      label: "deskripsi produk",
      name: "description",
      type: "textarea",
      defaultValue: "",
    }),
  ];

  return { fields };
};

export default Create;
