import { TrashIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useRef, useState } from "react";
import { ChildRef, InputFile } from "src/components/File";
import { IconColor } from "src/types";

const Banner = () => {
  const { banner, bannerUrl, onClickBanner, onChangeBanner, setBannerUrl } =
    useBanner();
  const { logo, logoUrl, setLogoUrl, onClickLogo, onChangeLogo } = useLogo();

  return (
    <>
      <main className="flex flex-col sm:flex-row gap-8">
        <InputFile
          label="logo usaha"
          blob={logoUrl}
          icons={[
            {
              src: <TrashIcon width={16} color={IconColor.red} />,
              onClick: () => setLogoUrl(""),
            },
          ]}
          file={{
            ref: logo,
            btnLabel: "unggah logo",
            onClick: onClickLogo,
            onChange: onChangeLogo,
          }}
        />

        <InputFile
          label="banner etalase"
          blob={bannerUrl}
          icons={[
            {
              src: <TrashIcon width={16} color={IconColor.red} />,
              onClick: () => setBannerUrl(""),
            },
          ]}
          file={{
            ref: banner,
            onClick: onClickBanner,
            onChange: onChangeBanner,
            btnLabel: "unggah banner",
          }}
        />
      </main>
    </>
  );
};

const useBanner = () => {
  const [bannerUrl, setBannerUrl] = useState("");
  const banner = useRef<ChildRef>(null);

  const onClickBanner = () => {
    if (banner.current) banner.current.click();
  };

  const onChangeBanner = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;

    const banner = URL.createObjectURL(e.target.files[0]);
    setBannerUrl(banner);
  };

  return {
    banner,
    bannerUrl,
    onClickBanner,
    onChangeBanner,
    setBannerUrl,
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
