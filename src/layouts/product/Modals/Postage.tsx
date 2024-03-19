import { Switch } from "@nextui-org/react";
import React from "react";
import { useForm } from "react-hook-form";
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
  Currency,
  CurrencyIDInput,
  handleErrorMessage,
  parseTextToNumber,
} from "src/helpers";
import useGeneralStore from "src/stores/generalStore";
import { useActiveModal } from "src/stores/modalStore";
import { UseForm } from "src/types";

interface PostageProps extends Pick<UseForm, "setValue" | "clearErrors"> {
  data?: DeliveryPrice;
}

interface PriceValues {
  price: string;
  wide: string;
  height: string;
  length: string;
  weight: string;
}

export const PostageModal: React.FC<PostageProps> = ({
  setValue,
  clearErrors,
  data,
}) => {
  const [isOutOfTown, setIsOutOfTown] = React.useState(false);
  const { isPostage, actionIsPostage } = useActiveModal();
  const { packageSize, outOfTownDeliveryField } = usePostage(data);

  const forms = useForm<PriceValues>();

  const handleSwitchOutOfTown = () => setIsOutOfTown((v) => !v);
  const setDeliveryPrice = useGeneralStore((v) => v.setDeliveryPrice);

  const onSubmit = forms.handleSubmit((e) => {
    let error = 0;
    if (e.weight === "0") {
      forms.setError("weight", { message: "Masukkan berat" });
      error++;
    }
    if (e.wide === "0") {
      forms.setError("wide", { message: "Masukkan lebar" });
      error++;
    }
    if (e.height === "0") {
      forms.setError("height", { message: "Masukkan tinggi" });
      error++;
    }
    if (e.length === "0") {
      forms.setError("length", { message: "Masukkan panjang" });
      error++;
    }
    if (e.price === "0") {
      forms.setError("price", { message: "Masukkan ongkir" });
      error++;
    }

    if (!error) {
      const isCourierInternal = !isOutOfTown ? true : false;
      let obj: DeliveryPrice = {
        id: "",
        isCourierInternal,
        height: parseTextToNumber(e.height),
        length: parseTextToNumber(e.length),
        price: parseTextToNumber(e.price),
        weight: parseTextToNumber(e.weight),
        wide: parseTextToNumber(e.wide),
      };

      setDeliveryPrice(obj);
      setValue("postage", e.price);
      clearErrors("postage");
      actionIsPostage();
    }
  });

  return (
    <Modal isOpen={isPostage} closeModal={actionIsPostage}>
      <section className="my-2 flexcol gap-4">
        <Textfield
          name="weight"
          placeholder="atur berat produk"
          label="berat produk"
          control={forms.control}
          defaultValue={!data ? "" : String(data?.weight)}
          errorMessage={handleErrorMessage(forms.formState.errors, "weight")}
          endContent={<ContentTextfield label="g" />}
          rules={{
            required: { value: true, message: "masukkan berat produk" },
            onBlur: (e) =>
              CurrencyIDInput({
                type: "rp",
                fieldName: "weight",
                setValue: forms.setValue,
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
                {...v}
                key={v.label}
                defaultValue={!data ? "" : String(v.defaultValue)}
                control={forms.control}
                endContent={<ContentTextfield label="cm" />}
                errorMessage={handleErrorMessage(
                  forms.formState.errors,
                  v.name
                )}
                rules={{
                  required: { value: true, message: v.errorMessage! },
                  onBlur: (e) =>
                    CurrencyIDInput({
                      type: "rp",
                      setValue: forms.setValue,
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
            control={forms.control}
            defaultValue={!data ? "" : String(Currency(data?.price ?? 0))}
            startContent={<ContentTextfield label="Rp" />}
            errorMessage={handleErrorMessage(forms.formState.errors, "price")}
            rules={{
              required: { value: true, message: "masukkan ongkir" },
              onBlur: (e) =>
                CurrencyIDInput({
                  type: "rp",
                  fieldName: "price",
                  setValue: forms.setValue,
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
                  control={forms.control}
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

export const usePostage = (data?: DeliveryPrice) => {
  const packageSize: TextfieldProps[] = [
    objectFields({
      name: "wide",
      label: "lebar",
      placeholder: "atur lebar",
      defaultValue: data?.wide,
    }),
    objectFields({
      name: "length",
      label: "panjang",
      defaultValue: data?.length,
      placeholder: "atur panjang",
    }),
    objectFields({
      name: "height",
      label: "tinggi",
      defaultValue: data?.height,
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
