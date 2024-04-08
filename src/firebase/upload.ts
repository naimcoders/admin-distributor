import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FbStorage } from ".";
import React from "react";

export interface IUpload {
  file: File;
  prefix: string;
}

export const uploadFile = async (req: IUpload) => {
  try {
    await uploadBytesResumable(ref(FbStorage, req.prefix), req.file);
  } catch (err) {
    const errs = err as Error;
    console.error(
      "error when upload file " + errs.message + " in prefix " + req.prefix
    );
  }
};

export const getFile = async (path: string, setFile: (v: string) => void) => {
  const fileRef = ref(FbStorage, path);
  // Kenapa ada useEffect disini?
  React.useEffect(() => {
    if (!path) return;
    getDownloadURL(fileRef)
      .then((e) => setFile(e))
      .catch((e) => console.error(e));
  }, [path]);
};
