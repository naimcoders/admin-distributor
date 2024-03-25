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
  const { actionIsPromotion, isPromotion } = useActiveModal();

  const fields: TextfieldProps[] = [
    objectFields({
      name: "normalPrice",
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
    }),
  ];

  return (
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

      <section className="flexcol gap-4">
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
                readOnly={{ isValue: true, cursor: "cursor-pointer" }}
              />
            )}
          </React.Fragment>
        ))}
      </section>

      <Button aria-label="mulai promosi" className="mx-auto block mt-8" />
    </Modal>
  );
};

export default Promotion;
