import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { usePilipay, type Activated } from "src/api/pilipay.service";
import { Modal } from "src/components/Modal";
import { Textfield } from "src/components/Textfield";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/react";
import { SendOtpType, useLogin } from "src/api/auth.service";
import { setUser } from "src/stores/auth";
import { toast } from "react-toastify";

interface ActivatedProps {
  isOpen: boolean;
  setOpen: (v: boolean) => void;
}

const ActivatedPilipay: FC<ActivatedProps> = ({ isOpen, setOpen }) => {
  const formState = useForm<Activated>();
  const user = setUser((v) => v.user);
  const [isVisible, setIsVisible] = useState(false);
  const { sendOtp } = useLogin();
  const { activated } = usePilipay();
  const [coordinate, setCoordinate] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setCoordinate({ lat: latitude, lng: longitude });
    });
  }, []);

  const handleActivated = async (req: Activated) => {
    try {
      if (!req.otpId) {
        toast.error("Otp is required");
        return;
      }

      toast.loading("Sedang memproses aktivasi", { toastId: "activated" });
      await activated.mutateAsync({
        lat: coordinate.lat,
        lng: coordinate.lng,
        otpId: req.otpId,
        otp: req.otp,
        pin: req.pin,
      });
      setOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      toast.dismiss("activated");
    }
  };

  return (
    <Modal isOpen={isOpen} closeModal={() => setOpen(false)}>
      <form
        className="space-y-3"
        onSubmit={formState.handleSubmit(handleActivated)}
      >
        <Textfield
          control={formState.control}
          name="pin"
          label="Pin"
          type={isVisible ? "number" : "password"}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={() => setIsVisible(!isVisible)}
            >
              {!isVisible ? (
                <EyeSlashIcon
                  width={18}
                  className="cursor-pointer"
                  title="Show"
                />
              ) : (
                <EyeIcon width={18} className="cursor-pointer" title="Hide" />
              )}
            </button>
          }
          errorMessage={formState?.formState?.errors?.pin?.message}
          rules={{
            required: "Pin is required",
            minLength: {
              value: 6,
              message: "Pin must be 6 characters",
            },
          }}
        />

        <Textfield
          control={formState.control}
          name="otp"
          type="number"
          label="Otp"
          errorMessage={formState?.formState?.errors?.otp?.message}
          endContent={
            <Button
              size="sm"
              color="primary"
              isLoading={sendOtp.isPending}
              onClick={() =>
                sendOtp
                  .mutateAsync({
                    phoneNumber: user?.phoneNumber ?? "",
                    role: user?.role ?? "",
                    type: SendOtpType.ACTIVATED,
                  })
                  .then((v) => {
                    formState.setValue("otpId", v);
                  })
                  .catch((err) => {
                    console.error(err);
                  })
              }
            >
              Kirim OTP
            </Button>
          }
          rules={{
            required: "Otp is required",
            minLength: {
              value: 6,
              message: "Otp must be 6 characters",
            },
          }}
        />

        <div className="bg-gray-300 w-full h-[0.004rem]" />

        <Button type="submit" color="primary" className="">
          Aktifasi Pilipay
        </Button>
      </form>
    </Modal>
  );
};

export default ActivatedPilipay;
