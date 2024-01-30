import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { FieldValues, useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Calendar } from "src/components/Calendar";
import { Modal } from "src/components/Modal";
import Select, { SelectDataProps } from "src/components/Select";
import { Textfield } from "src/components/Textfield";
import { handleErrorMessage } from "src/helpers";
import useGeneralStore from "src/stores/generalStore";
import { useActiveModal } from "src/stores/modalStore";

const data: SelectDataProps[] = [
  { label: "sales", value: "sales" },
  { label: "toko", value: "toko" },
];

const Report = () => {
  const setReportType = useGeneralStore((v) => v.setReportType);

  return (
    <main className="flexcol sm:flex-row gap-x-8 pt-3 items-end">
      <Select
        data={data}
        label="jenis report"
        placeholder="pilih jenis report"
        setSelected={setReportType}
        className="w-[20rem]"
      />

      <Period />

      <Button aria-label="export" />
    </main>
  );
};

export default Report;

const Period = () => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>();
  const { isPeriod, actionIsPeriod } = useActiveModal();

  return (
    <>
      <Textfield
        name="period"
        label="periode"
        defaultValue=""
        control={control}
        onClick={actionIsPeriod}
        placeholder="pilih periode report"
        endContent={<ChevronRightIcon width={16} />}
        errorMessage={handleErrorMessage(errors, "period")}
        readOnly={{ isValue: true, cursor: "cursor-pointer" }}
        rules={{ required: { value: true, message: "pilih periode report" } }}
        className="w-[20rem]"
      />

      <Modal title="periode" isOpen={isPeriod} closeModal={actionIsPeriod}>
        <Calendar close={actionIsPeriod} setValue={setValue} />
      </Modal>
    </>
  );
};
