import cx from "classnames";
import {
  PartialGeneralFields,
  Textfield,
  objectFields,
} from "src/components/Textfield";
import Template from "./Template";
import { FieldValues, useForm } from "react-hook-form";
import { handleErrorMessage } from "src/helpers";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";
import { UseForm } from "src/types";

const Rekening = () => {
  const {
    control,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({ mode: "onChange" });

  const { rekenings } = useRekening();
  const { actionIsBankName } = useActiveModal();

  const onSubmit = handleSubmit(async (e) => {
    console.log(e);
  });

  return (
    <Template title="detail rekening" onClick={onSubmit} btnLabelForm="simpan">
      {rekenings.map((el, idx) => (
        <div key={idx}>
          {["input"].includes(el.forField!) && (
            <Textfield
              type={el.type}
              label={el.label}
              control={control}
              name={el.name ?? ""}
              placeholder={el.placeholder}
              defaultValue={el.defaultValue}
              autoComplete={el.autoComplete}
              errorMessage={handleErrorMessage(errors, el.name)}
              rules={{
                required: { value: true, message: el.errorMessage ?? "" },
              }}
            />
          )}

          {["modal"].includes(el.forField!) && (
            <Textfield
              type={el.type}
              label={el.label}
              control={control}
              name={el.name ?? ""}
              placeholder={el.placeholder}
              defaultValue={el.defaultValue}
              autoComplete={el.autoComplete}
              errorMessage={handleErrorMessage(errors, el.name)}
              rules={{
                required: { value: true, message: el.errorMessage ?? "" },
              }}
              readOnly={el.readOnly}
              endContent={<ChevronRightIcon width={16} />}
              onClick={actionIsBankName}
            />
          )}
        </div>
      ))}

      <BankModal setValue={setValue} clearErrors={clearErrors} />
    </Template>
  );
};

const BankModal = ({
  setValue,
  clearErrors,
}: Pick<UseForm, "setValue" | "clearErrors">) => {
  const { isBankName, actionIsBankName } = useActiveModal();

  const data: string[] = [
    "Bank Mandiri",
    "Bank Rakyat Indonesia (BRI)",
    "Bank Central Asia (BCA)",
    "Bank Negara Indonesia",
  ];

  const key = "bankName";

  const onClick = (v: string) => {
    setValue(key, v);
    clearErrors(key);
    actionIsBankName();
  };

  return (
    <Modal title="nama bank" isOpen={isBankName} closeModal={actionIsBankName}>
      <ul className="flex flex-col gap-2 my-4">
        {data.map((v) => (
          <li
            key={v}
            className={cx("hover:font-interBold cursor-pointer w-max")}
            onClick={() => onClick(v)}
          >
            {v}
          </li>
        ))}
      </ul>
    </Modal>
  );
};

const useRekening = () => {
  const rekenings: PartialGeneralFields[] = [
    objectFields({
      name: "fullname",
      label: "nama sesuai rekening",
      type: "text",
      forField: "input",
      defaultValue: "",
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-pointer" },
      name: "bankName",
      label: "nama bank",
      type: "text",
      forField: "modal",
      defaultValue: "",
    }),
    objectFields({
      name: "noRek",
      label: "nomor rekening",
      type: "number",
      forField: "input",
      defaultValue: "",
    }),
  ];

  return { rekenings };
};

export default Rekening;
