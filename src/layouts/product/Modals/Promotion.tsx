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
import {
  CurrencyIDInput,
  handleErrorMessage,
  parseTextToNumber,
} from "src/helpers";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import ContentTextfield from "src/components/ContentTextfield";
import { Calendar } from "src/components/Calendar";
import useGeneralStore from "src/stores/generalStore";

interface PromotionProps extends Pick<UseForm, "setValue"> {
  images: string[];
  productName: string;
  description: string;
  normalPrice: string;
}

interface DefaultValueProps {
  price: string;
  discount: string;
  discountPercentage: string;
  period: string;
}

const rangeVariantPrice = (
  variantPrices: number[],
  discount: number | undefined
) => {
  if (!discount) return;

  const mapping = variantPrices.map((e) => {
    return (discount / e) * 100;
  });

  const min = formatNumber(Math.min(...mapping));
  const max = formatNumber(Math.max(...mapping));
  return `${min} - ${max}`;
};

const formatNumber = (value: number): string => {
  const hasDecimal = value % 1 !== 0;
  if (hasDecimal) return value.toFixed(2);
  return value.toString();
};

const Promotion = ({
  // setValue,
  images,
  productName,
  description,
  normalPrice,
}: PromotionProps) => {
  const [variantPrice, setVariantPrice] = React.useState<number[]>([]);

  const promoForm = useForm<DefaultValueProps>();
  const { fields, actionIsPromotion, isPromotion, isPeriod, onClosePeriod } =
    useFields(normalPrice);

  const variantTypes = useGeneralStore((v) => v.variantTypesDetailProduct);
  const setVariantTypesDetailProduct = useGeneralStore(
    (v) => v.setVariantTypesDetailProduct
  );

  React.useEffect(() => {
    if (variantTypes && variantTypes.length > 0) {
      const arr = variantTypes.map((m) =>
        m.variantColorProduct.map((e) => e.price)
      );
      arr.forEach((e) =>
        e.forEach((m) => {
          const data = m as number;
          setVariantPrice((v) => [...v, data]);
        })
      );
    }
  }, [variantTypes]);

  return (
    <>
      <Modal
        isOpen={isPromotion}
        closeModal={() => {
          setVariantPrice([]);
          setVariantTypesDetailProduct([]);
          actionIsPromotion();
        }}
      >
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
                  control={promoForm.control}
                  errorMessage={handleErrorMessage(
                    promoForm.formState.errors,
                    v.name
                  )}
                  rules={{
                    required: { value: true, message: v.errorMessage ?? "" },
                    onBlur: (e) => {
                      if (promoForm.getValues("discount")) {
                        promoForm.setValue(
                          "discountPercentage",
                          rangeVariantPrice(
                            variantPrice,
                            parseTextToNumber(e.target.value)
                          ) ?? ""
                        );

                        console.log(
                          rangeVariantPrice(variantPrice, e.target.value)
                        );
                      } else {
                        promoForm.setValue("discountPercentage", "");
                      }

                      if (v.name !== "discountPercentage") {
                        CurrencyIDInput({
                          type: v.type ?? "",
                          fieldName: v.name,
                          setValue: promoForm.setValue,
                          value: e.target.value,
                        });
                      }
                    },
                  }}
                />
              )}

              {["modal"].includes(v.type!) && (
                <Textfield
                  {...v}
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
                    <ChevronRightIcon
                      color={IconColor.zinc}
                      width={16}
                      className="cursor-default"
                    />
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

const useFields = (normalPrice: string) => {
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
      defaultValue: normalPrice,
      type: "text",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      name: "discount",
      label: "nilai diskon (Rp)",
      type: "rp",
      defaultValue: "",
      startContent: <ContentTextfield label="Rp" />,
    }),
    objectFields({
      name: "discountPercentage",
      label: "persentase diskon",
      type: "text",
      endContent: <ContentTextfield label="%" />,
      defaultValue: "",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      name: "period",
      label: "periode diskon",
      type: "modal",
      onClick: onOpenPeriod,
      defaultValue: "",
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
