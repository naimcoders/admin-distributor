import React from "react";
import cx from "classnames";
import Image from "src/components/Image";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { IconColor, UseForm } from "src/types";
import { Button } from "src/components/Button";
import { Textfield } from "src/components/Textfield";
import { useForm } from "react-hook-form";
import {
  Currency,
  CurrencyIDInput,
  handleErrorMessage,
  parseTextToNumber,
  roundNumber,
  setMinMaxCalendar,
  setRequiredField,
} from "src/helpers";
import { HiOutlineChevronRight } from "react-icons/hi2";
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

  const min = roundNumber(Math.min(...mapping));
  const max = roundNumber(Math.max(...mapping));
  return `${min}% - ${max}%`;
};

const Promotion = ({
  setValue,
  images,
  price,
  productName,
  description,
  normalPrice,
  productData,
  productId,
}: PromotionProps) => {
  const [variantPrice, setVariantPrice] = React.useState<number[]>([]);
  const promoForm = useForm<DefaultValueProps>();

  const variantTypes = useGeneralStore((v) => v.variantTypesDetailProduct);
  const setVariantTypesDetailProduct = useGeneralStore(
    (v) => v.setVariantTypesDetailProduct
  );

  const { actionIsPeriod, actionIsPromotion, isPromotion, isPeriod } =
    useActiveModal();

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
  const minDate = setMinMaxCalendar(new Date().getDate());

  const onClosePeriod = () => {
    actionIsPeriod();
    setTimeout(actionIsPromotion, 400);
  };

  const onSubmit = promoForm.handleSubmit(async (e) => {
    if (!productData) return null;

    try {
      toast.loading("Loading...", { toastId: "loading-promo" });
      await update.mutateAsync({
        data: {
          name: productData.name,
          deliveryPrice: productData.deliveryPrice,
          category: { categoryId: productData.categoryProduct.category.id },
          description: productData.description,
          subCategoryId: productData.subCategoryProduct?.id ?? "",
          price: {
            fee: parseTextToNumber(e.fee),
            price:
              variantTypes.length < 1 || !variantTypes[0].id
                ? parseTextToNumber(e.price)
                : parseTextToNumber(normalPrice.split("-")[0].trim()),
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
      setValue("promotion", `(${e.discount}) ${e.period}`);
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
          {/* {fields.map((v) => (
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
          ))} */}
          <Textfield
            name="price"
            label="harga normal"
            control={promoForm.control}
            defaultValue={normalPrice}
            readOnly={{ isValue: true, cursor: "cursor-default" }}
            startContent={<ContentTextfield label="Rp" />}
          />
          <Textfield
            name="discount"
            label="nilai diskon *"
            control={promoForm.control}
            defaultValue={
              productData?.price.priceDiscount
                ? Currency(productData?.price.priceDiscount ?? 0)
                : ""
            }
            errorMessage={handleErrorMessage(
              promoForm.formState.errors,
              "discount"
            )}
            placeholder="Masukkan nilai diskon"
            startContent={<ContentTextfield label="Rp" />}
            rules={{
              required: setRequiredField(true, "masukkan nilai diskon"),
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
                      `${roundNumber(calc)}%`
                    );
                  }
                  promoForm.clearErrors("discountPercentage");
                } else {
                  promoForm.setValue("discountPercentage", "");
                }

                CurrencyIDInput({
                  type: "rp",
                  fieldName: "discount",
                  setValue: promoForm.setValue,
                  value: e.target.value,
                });
              },
            }}
          />
          <Textfield
            name="discountPercentage"
            label="persentase diskon"
            control={promoForm.control}
            defaultValue=""
            readOnly={{ isValue: true, cursor: "cursor-default" }}
          />
          <Textfield
            name="fee"
            label="fee"
            control={promoForm.control}
            defaultValue=""
            placeholder="masukkan fee"
            rules={{
              onBlur: (e) =>
                CurrencyIDInput({
                  type: "rp",
                  fieldName: "fee",
                  setValue: promoForm.setValue,
                  value: e.target.value,
                }),
            }}
          />
          <Textfield
            name="period"
            label="periode"
            control={promoForm.control}
            defaultValue=""
            readOnly={{ isValue: true, cursor: "cursor-pointer" }}
            placeholder="tentukan periode"
            rules={{
              required: setRequiredField(true, "tentukan periode"),
            }}
            errorMessage={handleErrorMessage(
              promoForm.formState.errors,
              "period"
            )}
            onClick={() => {
              actionIsPromotion();
              setTimeout(actionIsPeriod, 400);
            }}
            endContent={
              <HiOutlineChevronRight width={16} color={IconColor.zinc} />
            }
          />
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
          minDate={minDate}
        />
      </Modal>
    </>
  );
};

export default Promotion;
