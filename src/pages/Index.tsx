import mokes from "src/assets/images/mokes.png";
import Image from "src/components/Image";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Button } from "src/components/Button";
import {
  PartialGeneralFields,
  Textfield,
  objectFields,
} from "src/components/Textfield";
import { handleErrorMessage } from "src/helpers";

const LoginPage = () => {
  return (
    <main className="bg-primary min-h-screen flex flex-col justify-between">
      <section className="md:px-12 py-8 flex flex-col gap-10 items-center md:flex-row justify-center md:gap-28 lg:gap-56 my-auto">
        <Image src={mokes} alt="Mokes" width={250} loading="lazy" />
        <section className="bg-secondary p-2 rounded-2xl flex flex-col gap-10 px-6 py-10 w-3/4 sm:w-96">
          <header>
            <h1 className="font-interBold capitalize text-lg sm:text-xl md:text-2xl">
              login admin distributor
            </h1>
          </header>
          <Form />
        </section>
      </section>
      <footer className="py-4 px-12 text-center">
        <p className="text-white">&copy;2024, nama perusahaan</p>
      </footer>
    </main>
  );
};

const logins: PartialGeneralFields[] = [
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
    autoComplete: "off",
  }),
];

const Form = () => {
  // const [token, setToken] = useState("");
  // useEffect(() => {
  //   requestForToken().then((token) => {
  //     setToken(token);
  //   });
  // }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({ mode: "onChange" });

  const onSubmit = handleSubmit(async (e) => {
    try {
      // const result = {
      //   email: e.email,
      //   password: e.password,
      //   role: Role.ADMIN,
      //   fcmToken: token,
      // };
      // await posted.mutateAsync(result);
      // navigate("/dashboard");
      console.log(e);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  });

  return (
    <section className="flex flex-col gap-5">
      {logins.map((el, idx) => (
        <Textfield
          key={idx}
          name={el.name ?? ""}
          type={el.type ?? "text"}
          label={el.label}
          defaultValue=""
          control={control}
          placeholder={el.placeholder ?? ""}
          autoComplete={el.autoComplete}
          errorMessage={handleErrorMessage(errors, el.name ?? "")}
          rules={{ required: { value: true, message: el.errorMessage ?? "" } }}
        />
      ))}

      <Button
        aria-label="Login"
        onClick={onSubmit}
        className="mt-4 text-base bg-accentYellow text-black"
      />
    </section>
  );
};

export default LoginPage;
