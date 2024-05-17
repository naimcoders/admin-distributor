import cx from "classnames";
import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import Template from "./Template";
import { FieldValues, useForm } from "react-hook-form";
import { handleErrorMessage } from "src/helpers";
import { HiOutlineChevronRight } from "react-icons/hi2";
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

  const { rekenings } = useHook();

  const onSubmit = handleSubmit(async (e) => {
    console.log(e);
  });

  return (
    <Template title="detail rekening" onClick={onSubmit} btnLabelForm="simpan">
      {rekenings.map((el, idx) => (
        <section key={idx}>
          {["text", "number"].includes(el.type!) && (
            <Textfield
              {...el}
              control={control}
              errorMessage={handleErrorMessage(errors, el.name)}
              rules={{
                required: { value: true, message: el.errorMessage ?? "" },
              }}
            />
          )}

          {["modal"].includes(el.type!) && (
            <Textfield
              {...el}
              control={control}
              errorMessage={handleErrorMessage(errors, el.name)}
              rules={{
                required: { value: true, message: el.errorMessage ?? "" },
              }}
              endContent={<HiOutlineChevronRight width={16} />}
            />
          )}
        </section>
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
            className={cx("hover:font-bold cursor-pointer w-max")}
            onClick={() => onClick(v)}
          >
            {v}
          </li>
        ))}
      </ul>
    </Modal>
  );
};

const useHook = () => {
  const { actionIsBankName } = useActiveModal();

  const rekenings: TextfieldProps<FieldValues>[] = [
    objectFields({
      name: "fullname",
      label: "nama sesuai rekening",
      type: "text",
      defaultValue: "",
    }),
    objectFields({
      readOnly: { isValue: true, cursor: "cursor-pointer" },
      name: "bankName",
      label: "nama bank",
      type: "modal",
      defaultValue: "",
      onClick: actionIsBankName,
    }),
    objectFields({
      name: "noRek",
      label: "nomor rekening",
      type: "number",
      defaultValue: "",
    }),
  ];

  return { rekenings };
};

export default Rekening;
