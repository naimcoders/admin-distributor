import cx from "classnames";
import piliDistributor from "src/assets/images/logo_pilidistributor.png";
import futureAccent from "src/assets/images/future_accent.png";
import Image from "src/components/Image";
import { useForm } from "react-hook-form";
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
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { IconColor } from "src/types";
import { Skeleton, Spinner } from "@nextui-org/react";
import { useAuth } from "src/firebase/auth";

const LoginPage = () => {
  const { notificationPermission } = useHook();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoadingPage, setIsLoadingPage] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      setIsLoadingPage(false);
      navigate("/dashboard");
    } else setIsLoadingPage(false);
  }, [user]);

  return (
    <>
      {isLoadingPage ? (
        <Skeleton />
      ) : (
        <main className="min-h-screen flex flex-col justify-between loginBackground">
          <section className="md:px-12 py-8 flex flex-col gap-8 items-center md:flex-row justify-center md:gap-5 lg:gap-96 my-auto">
            <Image
              src={piliDistributor}
              alt="PiliDistributor"
              width={250}
              loading="lazy"
              className="z-10"
            />

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

          <img
            src={futureAccent}
            alt="Future Accent"
            loading="lazy"
            className="w-[25rem] sm:w-[30rem] lg:w-[50%] absolute left-[4rem] opacity-60"
          />
        </main>
      )}
    </>
  );
};

export const useLoginFields = () => {
  const [isPassword, setIsPassword] = React.useState(false);

  const logins: TextfieldProps<LoginFieldProps>[] = [
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
    <HiOutlineEyeSlash
      size={18}
      className="cursor-pointer"
      onClick={onPassword}
      color={IconColor.zinc}
      title="Show"
    />
  ) : (
    <HiOutlineEye
      size={18}
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
        label={isPending ? <Spinner size="sm" /> : "Login"}
        onClick={onSubmit}
        className="mt-4 mx-auto text-base bg-accentYellow text-black"
      />
    </section>
  );
};
const useHook = () => {
  // kalau buat seperti ini useForm<LoginFieldProps>() <-- masukkan types nya di useForm x Jangan useForm<FieldValues>() ini useless jadinya
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFieldProps>();
  const [token, setToken] = React.useState("");
  const [notificationPermission, setNotificationPermission] =
    React.useState<NotificationPermission>("default");

  React.useEffect(() => {
    if (notificationPermission !== "granted") {
      onNotificationPermission();
    }
  }, [notificationPermission]);

  const { login } = useLoginApi();
  const navigate = useNavigate();

  const onNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.error("Browser tidak mendukung notifikasi");
      return;
    }

    let permission = await Notification.requestPermission();

    while (permission !== "granted") {
      permission = await Notification.requestPermission();
    }

    const getToken = await requestForToken();
    setToken(getToken);
    setNotificationPermission(permission);
  };

  const onSubmit = handleSubmit(async (e) => {
    try {
      if (notificationPermission !== "granted") {
        toast.error("Silakan izinkan notifikasi untuk login");
        return;
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
        if (notificationPermission !== "granted") {
          toast.error("Silakan izinkan notifikasi untuk login");
          return;
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
