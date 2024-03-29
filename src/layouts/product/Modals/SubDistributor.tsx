import cx from "classnames";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { useDistributor } from "src/api/distributor.service";
import Error from "src/components/Error";
import { UseForm } from "src/types";

interface SubDistributorProps
  extends Pick<UseForm, "setValue" | "clearErrors"> {
  subDistributorId: string;
  setDistributorId: (v: string) => void;
}

export const SubDistributorModal = ({
  setValue,
  clearErrors,
  setDistributorId,
  subDistributorId,
}: SubDistributorProps) => {
  const { isSubDistributor, actionIsSubDistributor } = useActiveModal();
  const { find } = useDistributor();
  const { data, isLoading, error } = find(1);
  const key = "subDistributor";

  const onClick = (id: string, name: string) => {
    setDistributorId(id);
    clearErrors(key);
    setValue(key, name);
    actionIsSubDistributor();
  };

  return (
    <Modal
      isOpen={isSubDistributor}
      closeModal={actionIsSubDistributor}
      title="sub-distributor"
    >
      {error ? (
        <Error error={error} />
      ) : isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="flex flex-col gap-2 my-4">
          {data?.items.map((v) => (
            <li
              key={v.id}
              onClick={() => onClick(v.id, v.name)}
              className={cx(
                "hover:font-bold cursor-pointer w-max",
                v.id === subDistributorId && "font-bold"
              )}
            >
              {v.name}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};
