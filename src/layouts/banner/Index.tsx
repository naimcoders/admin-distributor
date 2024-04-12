import { ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ChildRef, File, LabelAndImage } from "src/components/File";
import { IconColor } from "src/types";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { FbStorage } from "src/firebase";
import { toast } from "react-toastify";
import { setUser } from "src/stores/auth";

const Banner = () => {
  const { control } = useForm();
  const {
    banner,
    onClickBanner,
    onChangeBanner,
    setBannerUrl,
    bannerPercent,
    bannerUrl,
  } = useBanner();
  const { logo, logoUrl, setLogoUrl, onClickLogo, onChangeLogo, logoPercent } =
    useLogo();

  return (
    <section className="grid grid-cols-3 gap-4 lg:gap-8">
      {logoUrl ? (
        <LabelAndImage
          src={logoUrl}
          label="logo"
          actions={[
            {
              src: <TrashIcon color={IconColor.red} width={16} />,
              onClick: () => setLogoUrl(""),
            },
          ]}
        />
      ) : (
        <>
          <File
            name="logo"
            label="logo"
            control={control}
            placeholder="unggah logo"
            ref={logo}
            onClick={onClickLogo}
            onChange={onChangeLogo}
            startContent={<ArrowUpTrayIcon width={16} />}
          />
          {logoPercent > 0 && logoPercent < 100 && (
            <p>Loading: {logoPercent}</p>
          )}
        </>
      )}

      {bannerUrl ? (
        <LabelAndImage
          src={bannerUrl}
          label="banner etalase"
          actions={[
            {
              src: <TrashIcon color={IconColor.red} width={16} />,
              onClick: () => setBannerUrl(""),
            },
          ]}
        />
      ) : (
        <>
          <File
            name="logo"
            label="banner etalase"
            control={control}
            placeholder="unggah banner"
            ref={banner}
            onClick={onClickBanner}
            onChange={onChangeBanner}
            startContent={<ArrowUpTrayIcon width={16} />}
          />
          {bannerPercent > 0 && bannerPercent < 100 && (
            <p>Loading: {bannerPercent}</p>
          )}
        </>
      )}
    </section>
  );
};

const useBanner = () => {
  const [bannerUrl, setBannerUrl] = useState("");
  const banner = useRef<ChildRef>(null);
  const [bannerPercent, setBannerPercent] = useState(0);

  const user = setUser((v) => v.user);

  useEffect(() => {
    if (user) setBannerUrl(user.banner);
  }, [user]);

  const onClickBanner = () => {
    if (banner.current) banner.current.click();
  };

  const onChangeBanner = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = e.target.files[0];
    const fileNameFix = `distributor_banner/${user?.id}/${Date.now()}.png`;
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
  const [logoUrl, setLogoUrl] = useState("");
  const [logoPercent, setLogoPercent] = useState(0);
  const logo = useRef<ChildRef>(null);

  const user = setUser((v) => v.user);

  useEffect(() => {
    if (user) setLogoUrl(user.imageUrl);
  }, [user]);

  const onClickLogo = () => {
    if (logo.current) logo.current.click();
  };

  const onChangeLogo = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = e.target.files[0];
    const fileNameFix = `distributor/${user?.id}/${Date.now()}.png`;
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
