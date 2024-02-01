import { PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { ChildRef, File } from "src/components/File";
import Image from "src/components/Image";
import { IconColor } from "src/types";

const Create = () => {
  const { control } = useForm<FieldValues>();
  const { productPhotoRef, onClick, onChange, photos, setPhotos } =
    useUploadPhoto();

  return (
    <main className="flex gap-6 items-center flex-wrap">
      {photos.map((v) => (
        <Image
          src={v}
          alt="Product"
          key={v}
          className="aspect-square w-[10rem] object-cover rounded-md"
          icons={[
            {
              src: <TrashIcon width={16} />,
              onClick: () => setPhotos(photos.filter((e) => e !== v)),
            },
          ]}
        />
      ))}

      <File
        control={control}
        onClick={onClick}
        onChange={onChange}
        name="productPhoto"
        ref={productPhotoRef}
        placeholder="tambah foto"
        className="w-[10rem]"
        readOnly={{ isValue: true, cursor: "cursor-pointer" }}
        startContent={<PhotoIcon width={16} color={IconColor.zinc} />}
      />
    </main>
  );
};

const useUploadPhoto = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  const productPhotoRef = useRef<ChildRef>(null);

  const onClick = () => {
    if (productPhotoRef.current) productPhotoRef.current.click();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return null;

    const blob = URL.createObjectURL(e.target.files[0]);
    setPhotos([...photos, blob]);
  };

  return { productPhotoRef, onClick, onChange, photos, setPhotos };
};

export default Create;
