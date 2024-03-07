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
  const { banners, bannerPercent, logoPercent } = useHook();

  return (
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
          {v.name === "banner" && bannerPercent > 0 && bannerPercent < 100 && (
            <p>Loading: {bannerPercent}</p>
          )}
          {v.name === "logo" && logoPercent > 0 && logoPercent < 100 && (
            <p>Loading: {logoPercent}</p>
          )}
        </section>
      ))}
    </GridInput>
  );
};

const useHook = () => {
  const { banner, onClickBanner, onChangeBanner, setBannerUrl, bannerPercent } =
    useBanner();
  const { logo, logoUrl, setLogoUrl, onClickLogo, onChangeLogo, logoPercent } =
    useLogo();

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

  return { banners, bannerPercent, logoPercent };
};

const useBanner = () => {
  const { user } = useAuth();
  const [bannerUrl, setBannerUrl] = useState("");
  const banner = useRef<ChildRef>(null);
  const [bannerPercent, setBannerPercent] = useState(0);

  const onClickBanner = () => {
    if (banner.current) banner.current.click();
  };

  const onChangeBanner = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;

    const files = e.target.files[0];
    const fileNameFix = `banner/distributor/${user?.uid}/${Date.now()}.png`;
    const storageRef = ref(FbStorage, fileNameFix);
    const uploadTask = uploadBytesResumable(storageRef, files);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setBannerPercent(percent);
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
  const { user } = useAuth();
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPercent, setLogoPercent] = useState(0);
  const logo = useRef<ChildRef>(null);

  const onClickLogo = () => {
    if (logo.current) logo.current.click();
  };

  const onChangeLogo = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;

    const files = e.target.files[0];
    const fileNameFix = `distributor/${user?.uid}/${Date.now()}.png`;
    const storageRef = ref(FbStorage, fileNameFix);
    const uploadTask = uploadBytesResumable(storageRef, files);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setLogoPercent(percent);
      },
      (err) => console.error(err.message),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setLogoUrl(url);
        toast.success("Logo berhasil diunggah");
      }
    );
  };

  return {
    logo,
    logoUrl,
    onClickLogo,
    onChangeLogo,
    setLogoUrl,
    logoPercent,
  };
};

export default Banner;
