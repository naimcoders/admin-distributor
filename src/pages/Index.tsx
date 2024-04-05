import cx from "classnames";
import mokes from "src/assets/images/mokes.png";
import Image from "src/components/Image";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "src/components/Button";
import {
  TextfieldProps,
  Textfield,
  objectFields,
} from "src/components/Textfield";
import { handleErrorMessage } from "src/helpers";
import React from "react";
import { requestForToken } from "src/firebase";
import { useLogin as useLoginApi } from "src/api/auth.service";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { IconColor } from "src/types";

const LoginPage = () => {
  const { notificationPermission } = useHook();

  return (
    <main className="bg-primary min-h-screen flex flex-col justify-between">
      <section className="md:px-12 py-8 flex flex-col gap-10 items-center md:flex-row justify-center md:gap-28 lg:gap-56 my-auto">
        <Image src={mokes} alt="Mokes" width={250} loading="lazy" />
        <section className="bg-secondary p-2 rounded-2xl flex flex-col gap-10 px-6 py-10 w-3/4 sm:max-w-[28rem] relative">
          <span
            className={cx(
              "w-3 h-3 rounded-full absolute top-2 right-2",
              notificationPermission !== "granted"
                ? "bg-red-500"
                : "bg-green-500"
            )}
          ></span>

          <header>
            <h1 className="font-interBold capitalize text-lg sm:text-xl md:text-2xl">
              login admin distributor
            </h1>
          </header>
          <Form />
        </section>
      </section>
      <footer className="py-4 px-12 text-center">
        <p className="text-white">&copy;2024, MOKES, All Rights Reserved</p>
      </footer>
    </main>
  );
};

export const useLoginFields = () => {
  const [isPassword, setIsPassword] = React.useState(false);

  const logins: TextfieldProps[] = [
    objectFields({
      label: "email",
      name: "email",
      type: "email",
      autoComplete: "on",
    }),
    objectFields({
      label: "password",
      name: "password",
      type: !isPassword ? "password" : "text",
      endContent: checkPassword(isPassword, setIsPassword),
    }),
  ];

  return { logins };
};

export const checkPassword = (
  isPassword: boolean,
  setIsPassword: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const onPassword = () => setIsPassword((v) => !v);
  return !isPassword ? (
    <EyeSlashIcon
      width={18}
      className="cursor-pointer"
      onClick={onPassword}
      color={IconColor.zinc}
      title="Show"
    />
  ) : (
    <EyeIcon
      width={18}
      color={IconColor.zinc}
      className="cursor-pointer"
      onClick={onPassword}
      title="Hide"
    />
  );
};

interface LoginFieldProps {
  email: string;
  password: string;
}

const Form = () => {
  const { control, errors, onKeyDown, onSubmit, isPending } = useHook();
  const { logins } = useLoginFields();

  return (
    <section className="flex flex-col gap-8">
      {logins.map((el, idx) => (
        <Textfield
          {...el}
          key={idx}
          defaultValue=""
          control={control}
          onKeyDown={onKeyDown}
          className="max-w-full"
          errorMessage={handleErrorMessage(errors, el.name)}
          rules={{ required: { value: true, message: el.errorMessage! } }}
        />
      ))}

      <Button
        aria-label={isPending ? "Loading..." : "Login"}
        onClick={onSubmit}
        className="mt-4 mx-auto text-base bg-accentYellow text-black"
      />
    </section>
  );
};

const useHook = () => {
  const [token, setToken] = React.useState("");
  const [notificationPermission, setNotificationPermission] =
    React.useState("default");

  const notificationStatus: string[] = ["default", "denied"];

  React.useEffect(() => {
    if (notificationStatus.includes(notificationPermission)) {
      onNotificationPermission();
    } else requestToken();
  }, [notificationPermission]);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>();

  const { login } = useLoginApi();
  const navigate = useNavigate();

  const requestToken = async () => {
    try {
      toast.loading("Memuat token...", {
        toastId: "token",
      });
      const getToken = await requestForToken();
      setToken(getToken);
    } catch (e) {
      console.error(e);
    } finally {
      toast.dismiss("token");
    }
  };

  const onNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.error("Browser tidak mendukung notifikasi");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  };

  const onSubmit = handleSubmit(async (e) => {
    try {
      if (notificationStatus.includes(notificationPermission)) {
        toast.error("Silakan izinkan notifikasi untuk login");
      }

      if (token) {
        const result = {
          email: e.email,
          password: e.password,
          fcmToken: token,
        };

        await login.mutateAsync(result);
        navigate("/dashboard");
      }
    } catch (e) {
      const error = e as Error;
      if (error.message?.includes("fcmtoken")) {
        toast.error("Mohon aktifkan notifikasi");
      } else {
        toast.error(error.message);
      }
    }
  });

  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { email, password } = getValues() as LoginFieldProps;

    try {
      if (e.key === "Enter") {
        if (notificationStatus.includes(notificationPermission)) {
          toast.error("Silakan izinkan notifikasi untuk login");
        }

        if (token) {
          const result = {
            email: email,
            password: password,
            fcmToken: token,
          };

          await login.mutateAsync(result);
          navigate("/dashboard");
        }
      }
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    }
  };

  return {
    onSubmit,
    onKeyDown,
    control,
    errors,
    isPending: login.isPending,
    notificationPermission,
    token,
  };
};

export default LoginPage;
