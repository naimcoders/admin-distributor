import { ref, uploadBytesResumable } from "firebase/storage";
import { FbStorage } from ".";

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
