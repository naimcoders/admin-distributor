import { HiOutlineCheck, HiOutlinePlus, HiOutlineXMark } from "react-icons/hi2";
import { Button } from "./Button";
import { Textfield } from "./Textfield";
import { IconColor, UseForm } from "src/types";
import { handleErrorMessage } from "src/helpers";
import { VariantTypeProps } from "src/stores/generalStore";

interface ItemProps extends Pick<UseForm, "control" | "errors"> {
  title: string;
  update: {
    isUpdate: boolean;
    onEdit: () => void;
  };
  add: {
    isAdd: boolean;
    onAdd: () => void;
    fieldName: string;
    errorMessage: string;
    onSubmit: () => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  };
  variantTypes: VariantTypeProps[];
  children?: React.ReactNode;
  isActiveItem?: boolean;
}

export const ItemVariant: React.FC<ItemProps> = ({
  title,
  update,
  children,
  add,
  control,
  errors,
  isActiveItem,
  variantTypes,
}) => {
  return (
    <section className="flexcol gap-2">
      <section className="flex items-center justify-between mb-2">
        <h2 className="font-semibold capitalize">{title}</h2>
        {variantTypes?.length > 0 && (
          <button
            title="hapus"
            onClick={update.onEdit}
            className={`text-[${IconColor.red}] text-sm capitalize`}
          >
            {!update.isUpdate ? "hapus" : "selesai"}
          </button>
        )}
      </section>

      <section className="flexcol gap-2">
        <section className="flex gap-3 flex-wrap">
          {children}

          {!isActiveItem && (
            <Button
              label={!add.isAdd ? "tambah" : "batal"}
              endContent={
                !add.isAdd ? (
                  <HiOutlinePlus size={16} />
                ) : (
                  <HiOutlineXMark size={16} />
                )
              }
              className="w-[6rem] border border-gray-300 text-gray-500"
              color="default"
              variant="light"
              size="sm"
              onClick={add.onAdd}
            />
          )}
        </section>

        {add.isAdd && (
          <Textfield
            name={add.fieldName}
            defaultValue=""
            control={control}
            onKeyDown={add.onKeyDown}
            placeholder={add.errorMessage}
            errorMessage={handleErrorMessage(errors, add.fieldName)}
            rules={{
              required: {
                value: true,
                message: add.errorMessage,
              },
            }}
            endContent={
              <HiOutlineCheck
                size={16}
                title="Tambah"
                className="cursor-pointer"
                onClick={add.onSubmit}
              />
            }
          />
        )}
      </section>
    </section>
  );
};
