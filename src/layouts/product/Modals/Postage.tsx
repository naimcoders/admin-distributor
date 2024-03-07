import { Switch } from "@nextui-org/react";
import { FC, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { DeliveryPrice } from "src/api/product.service";
import { Button } from "src/components/Button";
import ContentTextfield from "src/components/ContentTextfield";
import { Modal } from "src/components/Modal";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import {
  CurrencyIDInput,
  handleErrorMessage,
  parseTextToNumber,
} from "src/helpers";
import useGeneralStore, {
  defaultValueDeliveryPrice,
} from "src/stores/generalStore";
import { useActiveModal } from "src/stores/modalStore";
import { UseForm } from "src/types";

export const PostageModal: FC<Pick<UseForm, "setValue" | "clearErrors">> = ({
  setValue,
  clearErrors,
}) => {
  const { isPostage, actionIsPostage } = useActiveModal();
  const { packageSize, outOfTownDeliveryField } = usePostage();
  const [isOutOfTown, setIsOutOfTown] = useState(false);
  const postageForm = useForm<FieldValues>();

  const handleSwitchOutOfTown = () => setIsOutOfTown((v) => !v);
  const setDeliveryPrice = useGeneralStore((v) => v.setDeliveryPrice);

  const onSubmit = postageForm.handleSubmit((e) => {
    const isCourierInternal = !isOutOfTown ? true : false;

    const fieldNames = ["weight", "height", "length", "wide", "price"];
    let obj: DeliveryPrice = defaultValueDeliveryPrice;

    for (const v in e) {
      if (fieldNames.includes(v)) {
        Object.assign(obj, { [v]: parseTextToNumber(e[v]) });
      }
    }

    obj.isCourierInternal = isCourierInternal;
    setDeliveryPrice(obj);

    setValue("postage", e.price);
    clearErrors("postage");
    postageForm.reset();
    actionIsPostage();
  });

  return (
    <Modal isOpen={isPostage} closeModal={actionIsPostage}>
      <section className="my-2 flexcol gap-4">
        <Textfield
          name="weight"
          placeholder="atur berat produk"
          label="berat produk"
          control={postageForm.control}
          defaultValue=""
          errorMessage={handleErrorMessage(
            postageForm.formState.errors,
            "weight"
          )}
          endContent={<ContentTextfield label="g" />}
          rules={{
            required: { value: true, message: "masukkan berat produk" },
            onBlur: (e) =>
              CurrencyIDInput({
                type: "rp",
                fieldName: "weight",
                setValue: postageForm.setValue,
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
                {...v}
                control={postageForm.control}
                endContent={<ContentTextfield label="cm" />}
                errorMessage={handleErrorMessage(
                  postageForm.formState.errors,
                  v.name
                )}
                rules={{
                  required: { value: true, message: v.errorMessage! },
                  onBlur: (e) =>
                    CurrencyIDInput({
                      type: "rp",
                      setValue: postageForm.setValue,
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
            name="price"
            label="kurir distributor"
            placeholder="atur ongkir"
            control={postageForm.control}
            defaultValue=""
            startContent={<ContentTextfield label="Rp" />}
            errorMessage={handleErrorMessage(
              postageForm.formState.errors,
              "price"
            )}
            rules={{
              required: { value: true, message: "masukkan ongkir" },
              onBlur: (e) =>
                CurrencyIDInput({
                  type: "rp",
                  fieldName: "price",
                  setValue: postageForm.setValue,
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
                  control={postageForm.control}
                  readOnly={v.readOnly}
                  description={v.description}
                  defaultValue={v.defaultValue}
                  startContent={<ContentTextfield label="Rp" />}
                />
              ))}
            </section>
          )}
        </section>

        <Button
          aria-label="simpan"
          className="mx-auto mt-4"
          onClick={onSubmit}
        />
      </section>
    </Modal>
  );
};

export const usePostage = () => {
  const packageSize: TextfieldProps[] = [
    objectFields({
      name: "wide",
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
