import React from "react";
import cx from "classnames";
import Image from "src/components/Image";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { UseForm } from "src/types";

interface PromotionProps extends Pick<UseForm, "setValue"> {
  images: string[];
  productName: string;
  description: string;
}

const Promotion = ({
  setValue,
  images,
  productName,
  description,
}: PromotionProps) => {
  const { actionIsPromotion, isPromotion } = useActiveModal();
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
    </Modal>
  );
};

export default Promotion;
