import React from "react";
import Template from "./Template";
import { useForm } from "react-hook-form";
import { Textfield } from "src/components/Textfield";
import { handleErrorMessage } from "src/helpers";
import { checkPassword } from "src/pages/Index";
import { setUser } from "src/stores/auth";
import { updateDistributor } from "src/api/distributor.service";
import { Spinner } from "@nextui-org/react";
import { HiOutlineXMark } from "react-icons/hi2";
import { IconColor } from "src/types";
import { toast } from "react-toastify";

const Password = () => {
  const [isOldPassword, setIsOldPassword] = React.useState(false);
  const [isNewPassword, setIsNewPassword] = React.useState(false);
  const [isConfirmNewPassword, setIsConfirmNewPassword] = React.useState(false);

  const {
    formEmail,
    isPending,
    onSubmitEmail,
    formPassword,
    onSubmitPassword,
  } = useApi();
  const user = setUser((v) => v.user);

  return (
    <main className="flex gap-4">
      <Template
        title="perbarui email"
        onClick={onSubmitEmail}
        btnLabelForm={
          isPending && !formPassword.getValues("newPassword") ? (
            <Spinner size="sm" color="secondary" />
          ) : (
            "Simpan"
          )
        }
        className="w-[20rem] h-max"
      >
        <Textfield
          name="email"
          label="email"
          defaultValue={user?.email}
          placeholder="Masukkan email"
          control={formEmail.control}
          rules={{
            required: { value: true, message: "Masukkan email" },
          }}
          errorMessage={handleErrorMessage(formEmail.formState.errors, "email")}
          endContent={
            <HiOutlineXMark
              size={16}
              color={IconColor.zinc}
              className="cursor-pointer"
              onClick={() => formEmail.setValue("email", "")}
            />
          }
        />
      </Template>

      <Template
        title="perbarui password"
        onClick={onSubmitPassword}
        btnLabelForm={
          isPending && formPassword.getValues("newPassword") ? (
            <Spinner size="sm" color="secondary" />
          ) : (
            "Simpan"
          )
        }
        className="w-[20rem]"
      >
        <Textfield
          label="password lama"
          name="oldPassword"
          defaultValue=""
          placeholder="Masukkan password lama"
          control={formPassword.control}
          rules={{
            required: { value: true, message: "Masukkan password lama" },
          }}
          errorMessage={handleErrorMessage(
            formPassword.formState.errors,
            "oldPassword"
          )}
          type={!isOldPassword ? "password" : "text"}
          endContent={checkPassword(isOldPassword, setIsOldPassword)}
        />
        <Textfield
          label="password baru"
          name="newPassword"
          defaultValue=""
          placeholder="Masukkan password baru"
          control={formPassword.control}
          rules={{
            required: { value: true, message: "Masukkan password baru" },
          }}
          errorMessage={handleErrorMessage(
            formPassword.formState.errors,
            "newPassword"
          )}
          type={!isNewPassword ? "password" : "text"}
          endContent={checkPassword(isNewPassword, setIsNewPassword)}
        />
        <Textfield
          label="konfirmasi password baru"
          name="confirmPassword"
          defaultValue=""
          placeholder="Masukkan konfirmasi password baru"
          control={formPassword.control}
          rules={{
            required: {
              value: true,
              message: "Masukkan konfirmasi password baru",
            },
          }}
          errorMessage={handleErrorMessage(
            formPassword.formState.errors,
            "confirmPassword"
          )}
          type={!isConfirmNewPassword ? "password" : "text"}
          endContent={checkPassword(
            isConfirmNewPassword,
            setIsConfirmNewPassword
          )}
        />
      </Template>
    </main>
  );
};

const useApi = () => {
  const formEmail = useForm<{ email: string }>();
  const formPassword = useForm<{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>();
  const user = setUser((v) => v.user);

  const { mutateAsync, isPending } = updateDistributor();

  const onSubmitEmail = formEmail.handleSubmit(async (e) => {
    if (!user) return;

    try {
      await mutateAsync({
        email: e.email,
        name: user.name,
        ownerName: user.ownerName,
        phoneNumber: user.phoneNumber,
      });
      toast.success("Email berhasil diperbarui");
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to update email: ${error.message}`);
    }
  });

  const onSubmitPassword = formPassword.handleSubmit(async (e) => {
    if (!user) return;

    try {
      if (e.newPassword !== e.confirmPassword) {
        formPassword.setError("confirmPassword", {
          message: "Konfirmasi password harus sama dengan password baru",
        });
        return;
      }

      await mutateAsync({
        email: user.email,
        password: e.newPassword,
        oldPassword: e.oldPassword,
        name: user.name,
        ownerName: user.ownerName,
        phoneNumber: user.phoneNumber,
      });
      toast.success("Password berhasil diperbarui");
      formPassword.reset();
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to update password: ${error.message}`);
    }
  });

  return {
    onSubmitEmail,
    onSubmitPassword,
    isPending,
    formEmail,
    formPassword,
  };
};

export default Password;
