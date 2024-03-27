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
      "erros when upload file " + errs.message + " in prefix " + req.prefix
    );
  }
};

export const getFile = async (path: string, setFile: (v: string) => void) => {
  const fileRef = ref(FbStorage, path);
  React.useEffect(() => {
    getDownloadURL(fileRef)
      .then((data) => setFile(data))
      .catch((e) => {
        const error = e as Error;
        console.error(`Failed to fetch image : ${error.message}`);
      });
  }, []);
};
