import React from "react";
import { ChildRef } from "src/components/File";

export const useKtp = () => {
  const [ktpFile, setKtpFile] = React.useState<File>();
  const [ktpBlob, setKtpBlob] = React.useState("");
  const ktpRef = React.useRef<ChildRef>(null);

  const onClickKtp = () => {
    if (ktpRef.current) ktpRef.current.click();
  };

  const onChangeKtp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const blob = URL.createObjectURL(files[0]);
    setKtpBlob(blob);
    setKtpFile(files[0]);
  };

  return { ktpBlob, ktpRef, onClickKtp, onChangeKtp, setKtpBlob, ktpFile };
};

export const useBanner = () => {
  const [bannerFile, setBannerFile] = React.useState<File>();
  const [bannerBlob, setBannerBlob] = React.useState("");
  const bannerRef = React.useRef<ChildRef>(null);

  const onClick = () => {
    if (bannerRef.current) bannerRef.current.click();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const blob = URL.createObjectURL(files[0]);
    setBannerBlob(blob);
    setBannerFile(files[0]);
  };

  return {
    bannerBlob,
    bannerRef,
    onClickBanner: onClick,
    onChangeBanner: onChange,
    setBannerBlob,
    bannerFile,
  };
};
