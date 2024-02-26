import { PencilIcon } from "@heroicons/react/24/outline";
import { FC, Fragment, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import { Textfield } from "src/components/Textfield";
import {
  Currency,
  CurrencyIDInput,
  handleErrorMessage,
  parseTextToNumber,
} from "src/helpers";
import useGeneralStore from "src/stores/generalStore";
import { useActiveModal } from "src/stores/modalStore";
import { IconColor, UseForm } from "src/types";

interface PriceProps extends Pick<UseForm, "setValue" | "clearErrors"> {
  fieldName: string;
}

const PriceModal = (props: PriceProps) => {
  const [isMassal, setIsMassal] = useState(false);
  const { isPrice, actionIsPrice } = useActiveModal();
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>();

  const variantTypes = useGeneralStore((v) => v.variantTypes);

  const handleMassalActive = () => {
    setIsMassal((v) => !v);
    reset();
  };

  const handleSubmitPrice = handleSubmit((e) => {
    if (!isMassal) {
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
        const [filterBySameName] = variantTypes.filter((f) => f.name === type);

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
      variantTypes.forEach((e) => {
        e.variantColorProduct?.forEach((f) => {
          f.price = parseTextToNumber(massalPrice);
        });
      });
      props.setValue(props.fieldName, massalPrice);
    }

    props.clearErrors(props.fieldName);
    console.log(variantTypes);
    // actionIsPrice();
  });

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
              {!isMassal ? (
                <>
                  <PencilIcon width={16} />
                  massal
                </>
              ) : (
                <>Batal</>
              )}
            </button>
          </section>

          {isMassal && (
            <Textfield
              name="massal"
              defaultValue=""
              control={control}
              placeholder="harga massal"
              startContent={
                <div className={`text-[${IconColor.zinc}] text-sm`}>Rp</div>
              }
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

        {!isMassal &&
          variantTypes.map((v, idx) => (
            <Fragment key={idx}>
              <hr />
              <section className="flexcol gap-4">
                <h2>{v.name}</h2>
                {v.variantColorProduct ? (
                  v.variantColorProduct.map((m, num) => (
                    <Field
                      key={num}
                      variant={m.name}
                      control={control}
                      setValue={setValue}
                      fieldName={`${v.name}_${m.name}`}
                      errors={errors}
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

        <Button
          aria-label="simpan"
          className="mx-auto mt-4"
          onClick={handleSubmitPrice}
        />
      </main>
    </Modal>
  );
};

interface FieldProps extends Pick<UseForm, "control" | "setValue" | "errors"> {
  fieldName: string;
  variant?: string;
}

const Field: FC<FieldProps> = ({
  control,
  setValue,
  variant,
  fieldName,
  errors,
}) => {
  return (
    <section className="grid grid-cols-3 items-center gap-2">
      {variant && <p className="col-span-2">{variant}</p>}
      <Textfield
        name={fieldName}
        control={control}
        defaultValue=""
        classNameWrapper={!variant ? "col-span-3" : "col-span-1"}
        startContent={
          <div className={`text-[${IconColor.zinc}] text-sm`}>Rp</div>
        }
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
