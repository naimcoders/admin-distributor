import Select, { SelectDataProps } from "src/components/Select";
import useGeneralStore from "src/stores/generalStore";

const data: SelectDataProps[] = [
  { label: "sales", value: "sales" },
  { label: "toko", value: "toko" },
];

const Report = () => {
  const setReportType = useGeneralStore((v) => v.setReportType);

  return (
    <main>
      <Select
        data={data}
        label="jenis report"
        placeholder="pilih jenis report"
        setSelected={setReportType}
      />
    </main>
  );
};

export default Report;
