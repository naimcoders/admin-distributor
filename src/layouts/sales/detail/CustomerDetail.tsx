import ktp from "src/assets/images/ktp.png";
import bannerEtalase from "src/assets/images/banner_etalase.jpg";

import {
  Textfield,
  TextfieldProps,
  objectFields,
} from "src/components/Textfield";
import { useActiveModal } from "src/stores/modalStore";
import { Fragment } from "react";
import { handleErrorMessage } from "src/helpers";
import { FieldValues, useForm } from "react-hook-form";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Modal } from "src/components/Modal";
import { UseForm } from "src/types";
import { Checkbox, CheckboxGroup } from "@nextui-org/react";
import { Button } from "src/components/Button";
import useGeneralStore from "src/stores/generalStore";
import { GridInput } from "src/layouts/Index";
import { LabelAndImage } from "src/components/File";
import {
  CoordinateProps,
  UserCoordinate,
  defaultCoordinate,
} from "src/components/Coordinate";

const CustomerDetail = () => {
  const {
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: "onChange",
  });

  const { fields } = useHook();

  return (
    <>
      <GridInput className="mt-2">
        {fields.map((v, idx) => (
          <Fragment key={idx}>
            {["text", "number", "email"].includes(v.type!) && (
              <Textfield
                type={v.type}
                name={v.name!}
                label={v.label}
                control={control}
                placeholder={v.placeholder}
                defaultValue={v.defaultValue}
                autoComplete={v.autoComplete}
                errorMessage={handleErrorMessage(errors, v.name)}
                rules={{
                  required: { value: true, message: v.errorMessage ?? "" },
                }}
                readOnly={v.readOnly}
              />
            )}

            {["modal"].includes(v.type!) && (
              <Textfield
                name={v.name!}
                label={v.label}
                control={control}
                onClick={v.onClick}
                readOnly={v.readOnly}
                placeholder={v.placeholder}
                defaultValue={v.defaultValue}
                autoComplete={v.autoComplete}
                endContent={<ChevronRightIcon width={16} />}
                errorMessage={handleErrorMessage(errors, v.name)}
                rules={{
                  required: { value: true, message: v.errorMessage ?? "" },
                }}
              />
            )}

            {["coordinate"].includes(v.type!) && (
              <UserCoordinate
                label={v.label!}
                lat={v.defaultValue.lat}
                lng={v.defaultValue.lng}
                cursor="default"
              />
            )}

            {["image"].includes(v.type!) && (
              <LabelAndImage label={v.label!} src={v.defaultValue} />
            )}
          </Fragment>
        ))}
      </GridInput>

      <PicSalesModal setValue={setValue} clearErrors={clearErrors} />
    </>
  );
};

const PicSalesModal = ({
  setValue,
  clearErrors,
}: Pick<UseForm, "setValue" | "clearErrors">) => {
  const picSales = useGeneralStore((v) => v.picSales) as string[];
  const setPicSales = useGeneralStore((v) => v.setPicSales);
  const { isCategory, actionIsCategory } = useActiveModal();

  const data: string[] = [
    "Andi, 085845672348",
    "Marlin, 085845672348",
    "Zulkifli, 085845672348",
    "Irfan, 085845672348",
  ];

  const key = "picSales";
  const onNext = () => {
    setValue(key, picSales);
    clearErrors(key);
    actionIsCategory();
  };

  return (
    <Modal title="PIC sales" isOpen={isCategory} closeModal={actionIsCategory}>
      <CheckboxGroup
        className="my-5"
        onChange={(e) => setPicSales(e)}
        defaultValue={picSales}
      >
        {data.map((v) => (
          <Checkbox
            value={v}
            key={v}
            id={v}
            name={v}
            classNames={{ label: "text-sm" }}
            size="sm"
          >
            {v}
          </Checkbox>
        ))}
      </CheckboxGroup>

      <div className="flex justify-center">
        <Button aria-label="selanjutnya" className="mx-auto" onClick={onNext} />
      </div>
    </Modal>
  );
};

const useHook = () => {
  // const { ktpBlob, ktpRef, onClick, onChange, setKtpBlob } = useKtp();
  const { actionIsCategory } = useActiveModal();

  const fields: TextfieldProps[] = [
    objectFields({
      label: "nama pemilik",
      name: "ownerName",
      type: "text",
      defaultValue: "Andi",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "nomor HP",
      name: "phoneNumber",
      type: "text",
      defaultValue: "085845678634",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "email",
      name: "email",
      type: "email",
      defaultValue: "-",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "tanggal join",
      name: "category",
      type: "text",
      defaultValue: "13 Des 2023",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "nama toko",
      name: "storeName",
      type: "text",
      defaultValue: "Mba Atun",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "alamat toko",
      name: "storeAddress",
      type: "text",
      defaultValue: "SULAWESI SELATAN, KOTA MAKASSAR",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "nama jalan, gedung, no. rumah",
      name: "street",
      type: "text",
      defaultValue: "Jl. Pongtiku No. 112",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "detail alamat",
      name: "detailAddress",
      type: "text",
      defaultValue: "Depan SMP Negeri 4",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "total revenue",
      name: "totalRevenue",
      type: "number",
      defaultValue: 112980000,
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "total transaksi",
      name: "totalTransaction",
      type: "number",
      defaultValue: 647,
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "rating",
      name: "rate",
      type: "text",
      defaultValue: "-",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "status akun",
      name: "statusAccount",
      type: "text",
      defaultValue: "-",
      readOnly: { isValue: true, cursor: "cursor-default" },
    }),
    objectFields({
      label: "PIC sales",
      name: "picSales",
      type: "modal",
      defaultValue: "-",
      onClick: actionIsCategory,
      readOnly: { isValue: true, cursor: "cursor-pointer" },
    }),
    objectFields({
      label: "koordinat toko",
      name: "coordinate",
      type: "coordinate",
      defaultValue: defaultCoordinate as CoordinateProps,
    }),
    objectFields({
      label: "KTP pemilik",
      name: "ktp",
      type: "image",
      defaultValue: ktp,
    }),
    objectFields({
      label: "banner etalase",
      name: "banner",
      type: "image",
      defaultValue: bannerEtalase,
    }),
  ];

  return { fields };
};

export default CustomerDetail;
