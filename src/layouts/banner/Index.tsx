import { ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { ChildRef, File, LabelAndImage } from "src/components/File";
import { TextfieldProps, objectFields } from "src/components/Textfield";
import { handleErrorMessage } from "src/helpers";
import { IconColor } from "src/types";
import { GridWithoutTextfield } from "../Index";

const Banner = () => {
  const {
    control,
    formState: { errors },
  } = useForm<FieldValues>();
  const { banners } = useHook();

  return (
    <GridWithoutTextfield>
      {banners.map((v) =>
        !v.defaultValue ? (
          <File
            name={v.name}
            key={v.label}
            label={v.label}
            control={control}
            placeholder={v.placeholder}
            ref={v.uploadImage?.file.ref}
            onClick={v.uploadImage?.file.onClick}
            onChange={v.uploadImage?.file.onChange}
            startContent={<ArrowUpTrayIcon width={16} />}
            errorMessage={handleErrorMessage(errors, v.name)}
            rules={{
              required: { value: true, message: v.errorMessage! },
            }}
          />
        ) : (
          <LabelAndImage
            key={v.label}
            label={v.label}
            src={v.defaultValue}
            actions={v.uploadImage?.image.actions}
          />
        )
      )}
    </GridWithoutTextfield>
  );
};

const useHook = () => {
  const { banner, bannerUrl, onClickBanner, onChangeBanner, setBannerUrl } =
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
      defaultValue: bannerUrl,
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

  return { banners };
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
