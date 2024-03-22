import cx from "classnames";
import idLocale from "date-fns/locale/id";
import { DateRangePicker } from "react-date-range";
import { useState } from "react";
import { dateToEpochConvert, epochToDateConvert } from "src/helpers";
import { Chip } from "@nextui-org/react";
import { Button } from "./Button";
import useGeneralStore from "src/stores/generalStore";
import { ActionModal, UseForm } from "src/types";

interface IDateRange {
  key: string;
  startDate: Date;
  endDate: Date;
}

export const Calendar = (
  r: Pick<ActionModal, "close"> & Pick<UseForm, "setValue">
) => {
  const { dateRange, handleSelect } = useHook();
  const date = useGeneralStore((v) => v.date);

  const onSubmit = () => {
    const startAt = dateToEpochConvert(new Date(date.startAt));
    const endAt = dateToEpochConvert(new Date(date.endAt));
    const start = epochToDateConvert(startAt);
    const end = epochToDateConvert(endAt);

    r.setValue("period", `${start} - ${end}`);
    r.close();
  };

  return (
    <section className="my-6 flex flex-col gap-2 items-center">
      <DateRangePicker
        ranges={dateRange as any}
        onChange={handleSelect as any}
        moveRangeOnFirstSelection={false}
        locale={idLocale}
        preview={{
          startDate: new Date(date.startAt),
          endDate: new Date(date.endAt),
        }}
      />

      {!date.startAt ? null : (
        <section className="flex flex-col gap-6">
          <div className="flex gap-6">
            <LabelPeriod label="dimulai" date={date.startAt} />
            <LabelPeriod label="berakhir" date={date.endAt} />
          </div>
          <Button aria-label="pilih periode" onClick={onSubmit} />
        </section>
      )}
    </section>
  );
};

const LabelPeriod = (props: {
  label: "dimulai" | "berakhir";
  date: string;
}) => {
  return (
    <section className="flex flex-col gap-1">
      <h2
        className={cx(
          "text-xs font-interMedium capitalize",
          props.label === "berakhir" ? "text-[#F31260]" : "text-[#1e1e1e]"
        )}
      >
        {props.label}
      </h2>
      <Chip
        variant="flat"
        classNames={{ base: "font-interMedium text-sm" }}
        color={props.label === "berakhir" ? "danger" : "default"}
      >
        {props.date}
      </Chip>
    </section>
  );
};

const useHook = () => {
  const setDate = useGeneralStore((v) => v.setDate);
  const [dateRange, setDateRange] = useState<IDateRange[]>([
    { key: "selection", startDate: new Date(), endDate: new Date() },
  ]);

  const handleSelect = ({ selection }: { selection: IDateRange }) => {
    setDateRange([
      {
        key: "selection",
        startDate: selection.startDate,
        endDate: selection.endDate,
      },
    ]);

    const startAtEpoch = dateToEpochConvert(selection.startDate);
    const endAtEpoch = dateToEpochConvert(selection.endDate);

    const startAtDate = epochToDateConvert(startAtEpoch);
    const endAtDate = epochToDateConvert(endAtEpoch);
    setDate({ startAt: startAtDate, endAt: endAtDate });
  };

  return { dateRange, handleSelect };
};
