import { Radio, RadioGroup } from "@nextui-org/react";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { UseForm } from "src/types";

export const ConditionModal = (p: Pick<UseForm, "setValue">) => {
  const { isCondition, actionIsCondition } = useActiveModal();
  return (
    <Modal title="kondisi" isOpen={isCondition} closeModal={actionIsCondition}>
      <RadioGroup
        color="primary"
        defaultValue="Baru"
        size="sm"
        className="mt-4"
        onValueChange={(val) => p.setValue("condition", val)}
      >
        <Radio value="Baru">Baru</Radio>
        <Radio value="Pernah Dipakai">Pernah Dipakai</Radio>
      </RadioGroup>
    </Modal>
  );
};
