import { ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { ChildRef, File } from "src/components/File";
import { TextfieldProps, objectFields } from "src/components/Textfield";
import { IconColor } from "src/types";
import { GridInput } from "../Index";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { FbStorage } from "src/firebase";
import { useAuth } from "src/firebase/auth";
import { toast } from "react-toastify";

const Banner = () => {
  const { control } = useForm<FieldValues>();
  const { banners, bannerPercent } = useHook();

  return (
    <>
      <GridInput className="grid-cols-3">
        {banners.map((v) => (
          <section key={v.label} className="flexcol gap-2">
            <File
              name={v.name}
              label={v.label}
              control={control}
              placeholder={v.placeholder}
              ref={v.uploadImage?.file.ref}
              onClick={v.uploadImage?.file.onClick}
              onChange={v.uploadImage?.file.onChange}
              startContent={<ArrowUpTrayIcon width={16} />}
            />
            {v.name === "banner" &&
              bannerPercent > 0 &&
              bannerPercent < 100 && <p>Loading: {bannerPercent}</p>}
          </section>
        ))}
      </GridInput>
    </>
  );
};

const useHook = () => {
  const { banner, onClickBanner, onChangeBanner, setBannerUrl, bannerPercent } =
    useBanner();
  const { logo, logoUrl, setLogoUrl, onClickLogo, onChangeLogo } = useLogo();

  const banners: TextfieldProps[] = [
    objectFields({
      label: "logo usaha",
      name: "logo",
      type: "file",
      placeholder: "unggah logo",
      defaultValue: logoUrl,
      uploadImage: {
        file: {
          ref: logo,
          onClick: onClickLogo,
          onChange: onChangeLogo,
        },
        image: {
          actions: [
            {
              src: <TrashIcon width={16} color={IconColor.red} />,
              onClick: () => setLogoUrl(""),
            },
          ],
        },
      },
    }),
    objectFields({
      label: "banner etalase",
      name: "banner",
      type: "file",
      placeholder: "unggah banner",
      defaultValue: "",
      uploadImage: {
        file: {
          ref: banner,
          onClick: onClickBanner,
          onChange: onChangeBanner,
        },
        image: {
          actions: [
            {
              src: <TrashIcon width={16} color={IconColor.red} />,
              onClick: () => setBannerUrl(""),
            },
          ],
        },
      },
    }),
  ];

  return { banners, bannerPercent };
};

const useBanner = () => {
  const { user } = useAuth();
  const [bannerUrl, setBannerUrl] = useState("");
  const banner = useRef<ChildRef>(null);
  const [bannerPercent, setBannerpercent] = useState(0);

  const onClickBanner = () => {
    if (banner.current) banner.current.click();
  };

  const onChangeBanner = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;

    const files = e.target.files[0];
    const fileName = `banner/distributor/${user?.uid}/${files.name}`;
    const storageRef = ref(FbStorage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, files);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        setBannerpercent(percent);
      },
      (err) => console.error(err.message),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setBannerUrl(url);
        toast.success("Banner berhasil diunggah");
      }
    );
  };

  return {
    banner,
    bannerUrl,
    onClickBanner,
    onChangeBanner,
    setBannerUrl,
    bannerPercent,
  };
};

const useLogo = () => {
  const [logoUrl, setLogoUrl] = useState("");
  const logo = useRef<ChildRef>(null);

  const onClickLogo = () => {
    if (logo.current) logo.current.click();
  };

  const onChangeLogo = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;

    const logo = URL.createObjectURL(e.target.files[0]);
    setLogoUrl(logo);
  };

  return {
    logo,
    logoUrl,
    onClickLogo,
    onChangeLogo,
    setLogoUrl,
  };
};

export default Banner;
