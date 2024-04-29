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
  Currency,
  CurrencyIDInput,
  epochToDateConvert,
  handleErrorMessage,
  parseTextToNumber,
} from "src/helpers";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import ContentTextfield from "src/components/ContentTextfield";
import { Calendar } from "src/components/Calendar";
import useGeneralStore from "src/stores/generalStore";
import { Product, useProduct } from "src/api/product.service";
import { toast } from "react-toastify";

interface PromotionProps extends Pick<UseForm, "setValue"> {
  images: string[];
  productName: string;
  description: string;
  normalPrice: string;
  price: number;
  productId: string;
  productData?: Product;
}

interface DefaultValueProps {
  price: string;
  discount: string;
  discountPercentage: string;
  period: string;
  fee: string;
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
  price,
  productData,
  productId,
}: PromotionProps) => {
  const [variantPrice, setVariantPrice] = React.useState<number[]>([]);

  const promoForm = useForm<DefaultValueProps>();
  const { fields, actionIsPromotion, isPromotion, isPeriod, onClosePeriod } =
    useFields(normalPrice, productData);

  const variantTypes = useGeneralStore((v) => v.variantTypesDetailProduct);
  const setVariantTypesDetailProduct = useGeneralStore(
    (v) => v.setVariantTypesDetailProduct
  );

  React.useEffect(() => {
    if (variantTypes[0]?.id) {
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

  const epoch = useGeneralStore((v) => v.epoch);
  const setEpoch = useGeneralStore((v) => v.setEpoch);
  const setDate = useGeneralStore((v) => v.setDate);
  const { update } = useProduct(productId);

  const onSubmit = promoForm.handleSubmit(async (e) => {
    if (!productData) return;

    try {
      toast.loading("Loading...", { toastId: "loading-promo" });

      await update.mutateAsync({
        data: {
          name: productData.name,
          isDangerous: productData.isDangerous,
          deliveryPrice: productData.deliveryPrice,
          category: { categoryId: productData.categoryProduct.category.id },
          description: productData.description,
          subCategoryId: productData.subCategoryProduct.id,
          price: {
            fee: Number(e.fee),
            price: !variantTypes[0]?.id ? parseTextToNumber(e.price) : 0,
            priceDiscount: parseTextToNumber(e.discount),
            expiredAt: epoch.endAt,
            startAt: epoch.startAt,
          },
          isAvailable: true,
        },
      });

      toast.success("Berhasil mengatur promosi");
      setEpoch({ endAt: 0, startAt: 0 });
      setDate({ endAt: "", startAt: "" });
      actionIsPromotion();
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to set promotion: ${error.message}`);
    } finally {
      toast.dismiss("loading-promo");
    }
  });

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
                      const discountValue = promoForm.getValues("discount");
                      if (discountValue) {
                        if (variantTypes[0]?.id) {
                          promoForm.setValue(
                            "discountPercentage",
                            rangeVariantPrice(
                              variantPrice,
                              parseTextToNumber(discountValue)
                            ) ?? ""
                          );
                        } else {
                          const discount = parseTextToNumber(discountValue);
                          const calc = (discount / price) * 100;
                          promoForm.setValue(
                            "discountPercentage",
                            Currency(calc)
                          );
                        }
                        promoForm.clearErrors("discountPercentage");
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
          onClick={onSubmit}
        />
      </Modal>

      <Modal title="periode" isOpen={isPeriod} closeModal={onClosePeriod}>
        <Calendar
          close={onClosePeriod}
          setValue={promoForm.setValue}
          clearErrors={promoForm.clearErrors}
          fieldName="period"
        />
      </Modal>
    </>
  );
};

const useFields = (normalPrice: string, productData?: Product) => {
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
      startContent: <ContentTextfield label="Rp" />,
      defaultValue: productData?.price.priceDiscount
        ? Currency(productData?.price.priceDiscount ?? 0)
        : "",
    }),
    objectFields({
      name: "discountPercentage",
      label: "persentase diskon",
      type: "text",
      endContent: <ContentTextfield label="%" />,
      readOnly: { isValue: true, cursor: "cursor-default" },
      defaultValue: "",
    }),
    objectFields({
      name: "fee",
      label: "fee",
      type: "number",
      defaultValue: productData?.price.fee
        ? Currency(productData?.price.fee ?? 0)
        : "",
    }),
    objectFields({
      name: "period",
      label: "periode diskon",
      type: "modal",
      onClick: onOpenPeriod,
      defaultValue: productData?.price.priceDiscount
        ? `${epochToDateConvert(
            productData?.price.startAt
          )} - ${epochToDateConvert(productData?.price.expiredAt)}`
        : "",
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
