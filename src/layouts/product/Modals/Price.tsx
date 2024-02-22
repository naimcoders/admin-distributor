import { PencilIcon } from "@heroicons/react/24/outline";
import { FieldValues, useForm } from "react-hook-form";
import { Modal } from "src/components/Modal";
import { Textfield } from "src/components/Textfield";
import { CurrencyIDInput } from "src/helpers";
import { useActiveModal } from "src/stores/modalStore";
import { IconColor } from "src/types";

const PriceModal = () => {
  const { isPrice, actionIsPrice } = useActiveModal();
  const { control, setValue } = useForm<FieldValues>();
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
        <hr />

        <section className="flexcol gap-3">
          <h2 className="font-semibold">Hitam</h2>
          <section className="flex items-center justify-start gap-4">
            <p>S</p>
            <Textfield
              name="hitam"
              control={control}
              defaultValue=""
              classNameWrapper="w-full"
              rules={{
                onBlur: (e) =>
                  CurrencyIDInput({
                    type: "rp",
                    fieldName: "hitam",
                    setValue,
                    value: e.target.value,
                  }),
              }}
              startContent={
                <div className={`text-[${IconColor.zinc}] text-sm`}>Rp</div>
              }
            />
          </section>
        </section>
      </main>
    </Modal>
  );
};

export default PriceModal;
