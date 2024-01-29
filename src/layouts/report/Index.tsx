import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { FieldValues, useForm } from "react-hook-form";
import Select, { SelectDataProps } from "src/components/Select";
import { Textfield } from "src/components/Textfield";
import { handleErrorMessage } from "src/helpers";
import useGeneralStore from "src/stores/generalStore";

const data: SelectDataProps[] = [
  { label: "sales", value: "sales" },
  { label: "toko", value: "toko" },
];

const Report = () => {
  const setReportType = useGeneralStore((v) => v.setReportType);

  return (
    <main className="grid grid-cols-3 gap-6">
      <Select
        data={data}
        label="jenis report"
        placeholder="pilih jenis report"
        setSelected={setReportType}
      />

      <Period />
    </main>
  );
};

export default Report;

const Period = () => {
  const {
    control,
    formState: { errors },
  } = useForm<FieldValues>();
  return (
    <Textfield
      name="period"
      label="periode"
      control={control}
      placeholder="pilih periode report"
      endContent={<ChevronRightIcon width={16} />}
      errorMessage={handleErrorMessage(errors, "period")}
      readOnly={{ isValue: true, cursor: "cursor-pointer" }}
      rules={{ required: { value: true, message: "pilih periode report" } }}
    />
  );
};
