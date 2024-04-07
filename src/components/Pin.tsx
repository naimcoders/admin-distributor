import React, { useEffect, useRef } from "react";
import { Input } from "@nextui-org/react";

export const TextfieldPin: React.FC<{
  onChangeValue: (v: string) => void;
}> = ({ onChangeValue }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [values, setValues] = React.useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  useEffect(() => {
    if (inputRefs.current.length > 0) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
    onChangeValue(newValues.join(""));
    if (value !== "" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && values[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <main className="flex flex-col gap-2">
      <section className="mt-2">
        <h2 className="text-sm capitalize mb-2">Masukkan Pin</h2>
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              name={`input${index}`}
              value={values[index]}
              className="rounded-md"
              classNames={{ input: "text-center" }}
              type="number"
              size="sm"
              maxLength={1}
              max={1}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              id={`input${index}`}
            />
          ))}
        </div>
      </section>
    </main>
  );
};
