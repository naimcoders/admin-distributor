import { HiOutlinePencil } from "react-icons/hi2";
import { FC, Fragment } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import ContentTextfield from "src/components/ContentTextfield";
import { Modal } from "src/components/Modal";
import { Textfield } from "src/components/Textfield";
import {
  Currency,
  CurrencyIDInput,
  handleErrorMessage,
  parseTextToNumber,
} from "src/helpers";
import { VariantTypeProps } from "src/stores/generalStore";
import { useActiveModal } from "src/stores/modalStore";
import { IconColor, UseForm } from "src/types";

interface PriceProps extends Pick<UseForm, "setValue" | "clearErrors"> {
  fieldName: string;
  isMassal: boolean;
  setIsMassal: React.Dispatch<React.SetStateAction<boolean>>;
  variantTypes: VariantTypeProps[];
}

const PriceModal: React.FC<PriceProps> = (props) => {
  const { isPrice, actionIsPrice, actionIsVariant } = useActiveModal();
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>();

  const handleMassalActive = () => {
    props.setIsMassal((v) => !v);
    reset();
  };

  const handleSubmitPrice = handleSubmit((e) => {
    if (!props.isMassal) {
      const values: number[] = [];
      for (const iterator in e) {
        const parseToNumber = parseTextToNumber(e[iterator]);
        values.push(parseToNumber);
      }

      const minVal = Currency(Math.min(...values));
      const maxVal = Currency(Math.max(...values));
      const resultVal = minVal === maxVal ? maxVal : `${minVal} - ${maxVal}`;

      for (const itr in e) {
        const [type, size] = itr.split("_");
        const [filterBySameName] = props.variantTypes.filter(
          (f) => f.name === type
        );

        filterBySameName?.variantColorProduct?.forEach((f) => {
          if (size === f.name) {
            const toNumber = parseTextToNumber(e[itr]);
            f.price = toNumber;
          }
        });
      }

      props.setValue(props.fieldName, resultVal);
    } else {
      const massalPrice = e.massal;
      props.variantTypes.forEach((e) => {
        e.variantColorProduct?.forEach((f) => {
          f.price = parseTextToNumber(massalPrice);
        });
      });
      props.setValue(props.fieldName, massalPrice);
    }

    props.clearErrors(props.fieldName);
    actionIsPrice();
    setTimeout(() => props.setIsMassal(false), 550);
  });

  const handleBack = () => {
    actionIsPrice();
    setTimeout(actionIsVariant, 500);
  };

  return (
    <Modal isOpen={isPrice} closeModal={actionIsPrice}>
      <main className="my-4 flexcol gap-5">
        <header className="flexcol gap-3">
          <section className="flex gap-4 justify-between">
            <h1 className="capitalize font-semibold">
              Atur harga variasi produk
            </h1>
            <button
              className={`text-[${IconColor.red}] text-sm capitalize hover:text-blue-500 inline-flex gap-1 items-center`}
              title="Edit secara massal"
              onClick={handleMassalActive}
            >
              {!props.isMassal ? (
                <>
                  <HiOutlinePencil width={16} />
                  massal
                </>
              ) : (
                <>Batal</>
              )}
            </button>
          </section>

          {props.isMassal && (
            <Textfield
              name="massal"
              defaultValue=""
              control={control}
              placeholder="harga massal"
              startContent={<ContentTextfield label="Rp" />}
              errorMessage={handleErrorMessage(errors, "massal")}
              rules={{
                required: {
                  value: true,
                  message: "masukkan harga",
                },
                onBlur: (e) =>
                  CurrencyIDInput({
                    type: "rp",
                    fieldName: "massal",
                    setValue,
                    value: e.target.value,
                  }),
              }}
            />
          )}
        </header>

        {!props.isMassal &&
          props.variantTypes?.map((v, idx) => (
            <Fragment key={idx}>
              <hr />
              <section className="flexcol gap-4">
                <h2>{v.name}</h2>
                {v.variantColorProduct?.length > 0 ? (
                  v.variantColorProduct?.map((m, num) => (
                    <Field
                      key={num}
                      variant={m.name}
                      control={control}
                      setValue={setValue}
                      fieldName={`${v.name}_${m.name}`}
                      errors={errors}
                      defaultValue={
                        m.price ? String(Currency(m.price ?? 0)) : ""
                      }
                    />
                  ))
                ) : (
                  <Field
                    key={idx}
                    control={control}
                    setValue={setValue}
                    fieldName={v.name ?? ""}
                    errors={errors}
                  />
                )}
              </section>
            </Fragment>
          ))}

        <section className="flex gap-4 mt-4">
          <Button
            variant="flat"
            label="kembali"
            className="w-full"
            onClick={handleBack}
          />
          <Button
            label="simpan"
            className="w-full"
            onClick={handleSubmitPrice}
          />
        </section>
      </main>
    </Modal>
  );
};

interface FieldProps extends Pick<UseForm, "control" | "setValue" | "errors"> {
  fieldName: string;
  variant?: string;
  defaultValue?: string;
}

const Field: FC<FieldProps> = ({
  control,
  setValue,
  variant,
  fieldName,
  errors,
  defaultValue,
}) => {
  return (
    <section className="grid grid-cols-3 items-center gap-2">
      {variant && <p className="col-span-2">{variant}</p>}
      <Textfield
        name={fieldName}
        control={control}
        defaultValue={defaultValue ?? ""}
        startContent={<ContentTextfield label="Rp" />}
        classNameWrapper={!variant ? "col-span-3" : "col-span-1"}
        rules={{
          required: {
            value: true,
            message: `masukkan harga`,
          },
          onBlur: (e) =>
            CurrencyIDInput({
              type: "rp",
              fieldName,
              setValue,
              value: e.target.value,
            }),
        }}
        errorMessage={handleErrorMessage(errors, fieldName)}
      />
    </section>
  );
};

export default PriceModal;
