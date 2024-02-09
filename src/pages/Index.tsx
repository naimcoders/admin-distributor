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
import { useEffect, useState } from "react";
import { requestForToken } from "src/firebase";
import { Role, useLogin } from "src/api/login.service";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  return (
    <main className="bg-primary min-h-screen flex flex-col justify-between">
      <section className="md:px-12 py-8 flex flex-col gap-10 items-center md:flex-row justify-center md:gap-28 lg:gap-56 my-auto">
        <Image src={mokes} alt="Mokes" width={250} loading="lazy" />
        <section className="bg-secondary p-2 rounded-2xl flex flex-col gap-10 px-6 py-10 w-3/4 sm:max-w-[28rem]">
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

export const logins: TextfieldProps[] = [
  objectFields({
    label: "email",
    name: "email",
    type: "email",
    autoComplete: "on",
  }),
  objectFields({
    label: "password",
    name: "password",
    type: "password",
  }),
];

const Form = () => {
  const [token, setToken] = useState("");
  useEffect(() => {
    requestForToken().then((token) => {
      setToken(token);
    });
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({ mode: "onChange" });

  const posted = useLogin();
  const navigate = useNavigate();

  const onSubmit = handleSubmit(async (e) => {
    try {
      const result = {
        email: e.email,
        password: e.password,
        role: Role.DISTRIBUTOR,
        fcmToken: token,
      };
      await posted.mutateAsync(result);
      navigate("/dashboard");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  });

  return (
    <section className="flexcol gap-8">
      {logins.map((el, idx) => (
        <Textfield
          {...el}
          key={idx}
          defaultValue=""
          control={control}
          className="max-w-full"
          errorMessage={handleErrorMessage(errors, el.name)}
          rules={{ required: { value: true, message: el.errorMessage! } }}
        />
      ))}

      <Button
        aria-label={posted.isPending ? "Loading..." : "Login"}
        onClick={onSubmit}
        className="mt-4 mx-auto text-base bg-accentYellow text-black"
      />
    </section>
  );
};

export default LoginPage;
