import { HiOutlineChevronRight } from "react-icons/hi2";
import { useForm } from "react-hook-form";
import { Button } from "src/components/Button";
import { Calendar } from "src/components/Calendar";
import { Modal } from "src/components/Modal";
import Select, { SelectDataProps } from "src/components/Select";
import { Textfield } from "src/components/Textfield";
import { handleErrorMessage } from "src/helpers";
import useGeneralStore from "src/stores/generalStore";
import { useActiveModal } from "src/stores/modalStore";

const data: SelectDataProps[] = [
  { label: "distributor", value: "distributor" },
  { label: "ekspedisi", value: "ekspedisi" },
  { label: "sales", value: "sales" },
  { label: "toko", value: "toko" },
];

const Report = () => {
  const setReportType = useGeneralStore((v) => v.setReportType);

  return (
    <main className="flex flex-col sm:flex-row gap-x-8 items-end">
      <Select
        data={data}
        label="jenis report"
        placeholder="pilih jenis report"
        setSelected={setReportType}
        className="w-[20rem]"
      />

      <Period />

      <Button label="export" />
    </main>
  );
};

export const Period = () => {
  const {
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();
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
        endContent={<HiOutlineChevronRight size={16} />}
        errorMessage={handleErrorMessage(errors, "period")}
        readOnly={{ isValue: true, cursor: "cursor-pointer" }}
        rules={{ required: { value: true, message: "pilih periode report" } }}
        className="w-[20rem]"
      />

      <Modal title="periode" isOpen={isPeriod} closeModal={actionIsPeriod}>
        <Calendar
          close={actionIsPeriod}
          setValue={setValue}
          clearErrors={clearErrors}
          fieldName="period"
        />
      </Modal>
    </>
  );
};

export default Report;
