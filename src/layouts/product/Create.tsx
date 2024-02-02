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
                icons={[
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
          <GridInput>
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

                {["textarea"].includes(v.type!) && (
                  <Textarea
                    label={v.label}
                    name={v.name}
                    defaultValue=""
                    control={control}
                    placeholder={v.placeholder}
                  />
                )}
              </Fragment>
            ))}
          </GridInput>

          <ModalCategory setValue={setValue} clearErrors={clearErrors} />
          <DangerousModal setValue={setValue} />
          <ConditionModal setValue={setValue} />
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
