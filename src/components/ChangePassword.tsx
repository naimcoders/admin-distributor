import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Modal } from "./Modal";
import { Textfield, TextfieldProps, objectFields } from "./Textfield";
import { Button } from "./Button";
import { checkPassword } from "src/pages/Index";
import { handleErrorMessage } from "src/helpers";
import { useActiveModal } from "src/stores/modalStore";

interface ChangePasswordModalProps<T extends object> {
  forms: UseFormReturn<T, any, undefined>;
  onSubmit: () => void;
}

export interface ChangePasswordValues {
  oldPassword: string;
  newPassword: string;
}

const ChangePasswordModal = <T extends object>({
  forms,
  onSubmit,
}: ChangePasswordModalProps<T>) => {
  const { isChangePassword, actionIsChangePassword } = useActiveModal();
  const { changePasswordFields } = useChangePassword();

  return (
    <Modal
      isOpen={isChangePassword}
      closeModal={actionIsChangePassword}
      title="ubah password"
    >
      <section className="flex flex-col gap-4 mt-5 mb-3">
        {changePasswordFields.map((v) => (
          <Textfield
            key={v.name}
            {...v}
            defaultValue=""
            control={forms.control}
            errorMessage={handleErrorMessage(forms.formState.errors, v.name)}
            rules={{
              required: { value: true, message: v.errorMessage ?? "" },
            }}
          />
        ))}

        <Button
          aria-label="simpan perubahan"
          onClick={onSubmit}
          className="mx-auto mt-5"
        />
      </section>
    </Modal>
  );
};

export const useChangePassword = () => {
  const [isOldPwd, setIsOldPwd] = React.useState(false);
  const [isNewPwd, setIsNewPwd] = React.useState(false);

  const changePasswordFields: TextfieldProps[] = [
    objectFields({
      name: "oldPassword",
      type: !isOldPwd ? "password" : "text",
      label: "password lama",
      endContent: checkPassword(isOldPwd, setIsOldPwd),
    }),
    objectFields({
      name: "newPassword",
      type: !isNewPwd ? "password" : "text",
      label: "password baru",
      endContent: checkPassword(isNewPwd, setIsNewPwd),
    }),
  ];

  return { changePasswordFields };
};

export default ChangePasswordModal;
