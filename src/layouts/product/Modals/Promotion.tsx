import React from "react";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { UseForm } from "src/types";

interface PromotionProps extends Pick<UseForm, "setValue"> {}

const Promotion = ({ setValue }: PromotionProps) => {
  const { actionIsPromotion, isPromotion } = useActiveModal();
  return (
    <Modal isOpen={isPromotion} closeModal={actionIsPromotion}>
      Lorem ipsum dolor sit amet.
    </Modal>
  );
};

export default Promotion;
