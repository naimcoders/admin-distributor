import { PencilIcon } from "@heroicons/react/24/outline";
import { FC, Fragment } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Modal } from "src/components/Modal";
import { Textfield } from "src/components/Textfield";
import { CurrencyIDInput } from "src/helpers";
import useGeneralStore from "src/stores/generalStore";
import { useActiveModal } from "src/stores/modalStore";
import { IconColor, UseForm } from "src/types";

const PriceModal = () => {
  const { isPrice, actionIsPrice } = useActiveModal();
  const { control, setValue } = useForm<FieldValues>();
  const variantTypes = useGeneralStore((v) => v.variantTypes);

  return (
    <Modal isOpen={isPrice} closeModal={actionIsPrice}>
      <main className="my-4 flexcol gap-5">
        <header className="flex gap-4 justify-between">
          <h1 className="capitalize font-semibold">
            Atur harga variasi produk
          </h1>
          <button
            className={`text-[${IconColor.red}] text-sm capitalize hover:text-blue-500 inline-flex gap-1 items-center`}
            title="Edit secara massal"
          >
            <PencilIcon width={16} />
            massal
          </button>
        </header>

        {variantTypes.map((v, idx) => (
          <Fragment key={idx}>
            <hr />
            <section className="flexcol gap-4">
              <h2>{v.name}</h2>
              {v.variantColorProduct ? (
                v.variantColorProduct.map((m, num) => (
                  <Field
                    variant={m.name}
                    fieldName={m.name}
                    control={control}
                    setValue={setValue}
                    key={`${v.name}-${num}`}
                  />
                ))
              ) : (
                <Field
                  fieldName={v.name ?? ""}
                  control={control}
                  setValue={setValue}
                  key={`${v.name}-${idx}`}
                />
              )}
            </section>
          </Fragment>
        ))}

        <Button aria-label="simpan" className="mx-auto mt-4" />
      </main>
    </Modal>
  );
};

interface FieldProps extends Pick<UseForm, "control" | "setValue"> {
  fieldName: string;
  variant?: string;
}

const Field: FC<FieldProps> = ({ control, setValue, variant, fieldName }) => {
  return (
    <section className="grid grid-cols-3 items-center gap-2">
      {variant && <p className="col-span-2">{variant}</p>}
      <Textfield
        name={fieldName}
        control={control}
        defaultValue=""
        classNameWrapper="col-span-1"
        rules={{
          onBlur: (e) =>
            CurrencyIDInput({
              type: "rp",
              fieldName,
              setValue,
              value: e.target.value,
            }),
        }}
        startContent={
          <div className={`text-[${IconColor.zinc}] text-sm`}>Rp</div>
        }
      />
    </section>
  );
};

export default PriceModal;
