import { Switch } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { UseForm } from "src/types";

export const DangerousModal = (p: Pick<UseForm, "setValue">) => {
  const { isDangerous, actionIsDangerous } = useActiveModal();
  const [isStatus, setIsStatus] = useState(false);

  useEffect(() => {
    p.setValue("dangerous", isStatus ? "Ya" : "Tidak");
  }, [isStatus]);

  return (
    <Modal isOpen={isDangerous} closeModal={actionIsDangerous}>
      <section className="my-4 flexcol gap-5">
        <h1>Mengandung baterai/magnet/cairan/bahan mudah terbakar</h1>
        <Switch
          color="success"
          id="switch"
          name="switch"
          size="sm"
          isSelected={isStatus}
          onValueChange={setIsStatus}
        >
          {isStatus ? "Ya" : "Tidak"}
        </Switch>
      </section>
    </Modal>
  );
};
