import idLocale from "date-fns/locale/id";
import { DateRangePicker } from "react-date-range";
import React, { useState } from "react";
import { dateToEpochConvert, epochToDateConvert } from "src/helpers";
import { Button } from "./Button";
import { ActionModal, UseForm } from "src/types";
import useGeneralStore from "src/stores/generalStore";

interface IDateRange {
  key: string;
  startDate: Date;
  endDate: Date;
}

export const Calendar = (
  r: Pick<ActionModal, "close"> & Pick<UseForm, "setValue">
) => {
  const { dateRange, handleSelect, epochTime } = useHook();
  const date = useGeneralStore((v) => v.date);

  const onSubmit = () => {
    r.setValue("period", `${date.startAt} - ${date.endAt}`);
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

      {!epochTime.start && !epochTime.end ? null : (
        <Button label="pilih periode" onClick={onSubmit} className="mx-auto" />
      )}
    </section>
  );
};

interface Time {
  start: number;
  end: number;
}

const useHook = () => {
  const [epochTime, setEpochTime] = React.useState<Time>({
    start: 0,
    end: 0,
  });
  const setDate = useGeneralStore((v) => v.setDate);
  const setEpoch = useGeneralStore((v) => v.setEpoch);

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
    setEpochTime({ start: startAtEpoch, end: endAtEpoch });
    setEpoch({ startAt: startAtEpoch, endAt: endAtEpoch });
    setDate({ startAt: startAtDate, endAt: endAtDate });
  };

  return { dateRange, handleSelect, epochTime };
};
