export async function cropImage(
  url: string,
  aspectRatio: number
): Promise<HTMLCanvasElement> {
  // We return a Promise that gets resolved with our canvas element
  return new Promise((resolve) => {
    // This image will hold our source image data
    const inputImage = new Image();

    // We want to wait for our image to load
    inputImage.onload = () => {
      // Let's store the width and height of our image
      const inputWidth = inputImage.naturalWidth;
      const inputHeight = inputImage.naturalHeight;

      // Get the aspect ratio of the input image
      const inputImageAspectRatio = inputWidth / inputHeight;

      // If it's bigger than our target aspect ratio
      let outputWidth = inputWidth;
      let outputHeight = inputHeight;
      if (inputImageAspectRatio > aspectRatio) {
        outputWidth = inputHeight * aspectRatio;
      } else if (inputImageAspectRatio < aspectRatio) {
        outputHeight = inputWidth / aspectRatio;
      }

      // Calculate the position to draw the image at
      const outputX = (outputWidth - inputWidth) * 0.5;
      const outputY = (outputHeight - inputHeight) * 0.5;

      // Create a canvas that will present the output image
      const outputImage = document.createElement("canvas");

      // Set it to the same size as the image
      outputImage.width = outputWidth;
      outputImage.height = outputHeight;

      // Draw our image at position 0, 0 on the canvas
      const ctx = outputImage.getContext("2d");
      if (ctx) {
        ctx.drawImage(inputImage, outputX, outputY);
        resolve(outputImage);
      } else {
        throw new Error("Canvas context is null");
      }
    };

    // Start loading our image
    inputImage.src = url;
  });
}

export function base64ToBlob(base64String: string): Blob {
  // Split the base64 string to get the content type and the base64 data
  const parts = base64String.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const rawBase64Data = parts[1];

  // Convert the base64 data to a Uint8Array
  const byteCharacters = atob(rawBase64Data);
  const byteArray = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }

  // Create a Blob from the Uint8Array
  return new Blob([byteArray], { type: contentType });
}

export type TUsePickImage = {
  file: File;
  ratio?: number;
};

function base64ToFile(
  base64String: string,
  fileName: string,
  mimeType: string
) {
  // Convert base64 to Uint8Array
  const base64Data = base64String.split(",")[1];

  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Create Blob from Uint8Array
  const blob = new Blob([byteArray], { type: mimeType });
  // Create File from Blob
  const file = new File([blob], fileName, { type: mimeType });
  return file;
}

export const onPickImage = async (
  r: TUsePickImage
): Promise<{
  file: File;
  url: string;
}> => {
  const files = r.file;
  const ratio = r.ratio || 5 / 5;

  const toCrop = await cropImage(URL.createObjectURL(files), ratio);
  const f = base64ToFile(toCrop.toDataURL(), files.name, files.type);
  const blob = URL.createObjectURL(f);

  return {
    file: f,
    url: blob,
  };
};
