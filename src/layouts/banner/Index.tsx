import {
  ArrowUpTrayIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ChangeEvent, useRef, useState } from "react";
import { Button } from "src/components/Button";
import { ChildRef, File } from "src/components/File";
import { IconImage } from "src/components/Image";

const Banner = () => {
  const { logo, logoUrl, onClickLogo, onChangeLogo } = useLogo();
  const { banner, bannerUrl, onClickBanner, onChangeBanner } = useBanner();

  const icons: IconImage[] = [
    {
      src: <TrashIcon width={16} color="#F31260" />,
      onClick: () => console.log("image id"),
    },
  ];

  return (
    <>
      <main className="flex flex-col sm:flex-row gap-8">
        <File
          ref={logo}
          onClick={onClickLogo}
          onChange={onChangeLogo}
          title="logo/foto usaha"
          btnLabel="unggah logo/foto usaha"
          image={{ src: logoUrl, width: 200 }}
          startContent={<ArrowUpTrayIcon width={16} />}
          icons={icons}
        />

        <File
          ref={banner}
          onClick={onClickBanner}
          onChange={onChangeBanner}
          title="banner etalase"
          btnLabel="unggah banner etalase"
          image={{ src: bannerUrl, width: 400 }}
          startContent={<ArrowUpTrayIcon width={16} />}
          icons={icons}
        />
      </main>
      <Button
        aria-label="simpan"
        onClick={() => console.log("save")}
        className="mx-auto mt-5"
        startContent={<PlusIcon width={16} />}
      />
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
  };
};

export default Banner;
