import React from "react";
import cx from "classnames";
import Image from "src/components/Image";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { IconColor, UseForm } from "src/types";
import { Button } from "src/components/Button";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { useForm } from "react-hook-form";
import { CurrencyIDInput, handleErrorMessage } from "src/helpers";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import ContentTextfield from "src/components/ContentTextfield";
import { Calendar } from "src/components/Calendar";

interface PromotionProps extends Pick<UseForm, "setValue"> {
  images: string[];
  productName: string;
  description: string;
}

interface DefaultValueProps {
  price: string;
  discount: string;
  discountPercentage: string;
  period: string;
}

const Promotion = ({
  // setValue,
  images,
  productName,
  description,
}: PromotionProps) => {
  const promoForm = useForm<DefaultValueProps>();
  const { fields, actionIsPromotion, isPromotion, isPeriod, onClosePeriod } =
    useFields();

  return (
    <>
      <Modal isOpen={isPromotion} closeModal={actionIsPromotion}>
        <header className="flex gap-4">
          {images.map((v, k) => (
            <Image
              key={k}
              src={v}
              alt="Product"
              className={cx(
                "w-[6rem] aspect-square border border-gray-400 object-cover rounded-md"
              )}
            />
          ))}
        </header>
        <section className="my-5">
          <h2 className="font-bold text-lg">{productName}</h2>
          <p className="text-sm">{description}</p>
        </section>

        <section className="flex flex-col gap-4">
          {fields.map((v) => (
            <React.Fragment key={v.name}>
              {["text", "rp", "number"].includes(v.type!) && (
                <Textfield
                  {...v}
                  defaultValue=""
                  control={promoForm.control}
                  errorMessage={handleErrorMessage(
                    promoForm.formState.errors,
                    v.name
                  )}
                  rules={{
                    required: { value: true, message: v.errorMessage ?? "" },
                    onBlur: (e) =>
                      CurrencyIDInput({
                        type: v.type ?? "",
                        fieldName: v.name,
                        setValue: promoForm.setValue,
                        value: e.target.value,
                      }),
                  }}
                />
              )}

              {["modal"].includes(v.type!) && (
                <Textfield
                  {...v}
                  defaultValue=""
                  readOnly={{ isValue: true, cursor: "cursor-pointer" }}
                  errorMessage={handleErrorMessage(
                    promoForm.formState.errors,
                    v.name
                  )}
                  rules={{
                    required: { value: true, message: v.errorMessage ?? "" },
                  }}
                  control={promoForm.control}
                  endContent={
                    <ChevronRightIcon color={IconColor.zinc} width={16} />
                  }
                />
              )}
            </React.Fragment>
          ))}
        </section>

        <Button
          label="mulai promosi"
          className="mx-auto block mt-8"
          onClick={() => console.log("submit promotion")}
        />
      </Modal>

      <Modal title="periode" isOpen={isPeriod} closeModal={onClosePeriod}>
        <Calendar close={onClosePeriod} setValue={promoForm.setValue} />
      </Modal>
    </>
  );
};

const useFields = () => {
  const { actionIsPeriod, actionIsPromotion, isPromotion, isPeriod } =
    useActiveModal();

  const onOpenPeriod = () => {
    actionIsPromotion();
    setTimeout(actionIsPeriod, 400);
  };

  const onClosePeriod = () => {
    actionIsPeriod();
    setTimeout(actionIsPromotion, 400);
  };

  const fields: TextfieldProps<DefaultValueProps>[] = [
    objectFields({
      name: "price",
      label: "harga normal",
      type: "rp",
    }),
    objectFields({
      name: "discount",
      label: "diskon",
      type: "rp",
    }),
    objectFields({
      name: "discountPercentage",
      label: "persentase diskon",
      type: "number",
      endContent: <ContentTextfield label="%" />,
    }),
    objectFields({
      name: "period",
      label: "periode diskon",
      type: "modal",
      onClick: onOpenPeriod,
    }),
  ];
  return {
    fields,
    actionIsPromotion,
    isPeriod,
    isPromotion,
    onClosePeriod,
  };
};

export default Promotion;
