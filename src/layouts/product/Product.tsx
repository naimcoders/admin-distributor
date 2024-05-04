import Label, { LabelPrice } from "src/components/Label";
import { TableWithSearchAndTabs } from "src/components/Table";
import { Product, useProduct } from "src/api/product.service";
import { FieldValues, useForm } from "react-hook-form";
import { Columns } from "src/types";
import { Actions } from "src/components/Actions";
import {
  Currency,
  epochToDateConvert,
  stringifyQuery,
  useSetSearch,
} from "src/helpers";
import { useNavigate } from "react-router-dom";
import React from "react";
import { setUser } from "src/stores/auth";
import { useSuspend } from "../distributor/Index";
import { ConfirmModal } from "src/components/Modal";
import { toast } from "react-toastify";
import { useActiveModal } from "src/stores/modalStore";
import Pagination from "src/components/Pagination";

const SubProduct = ({ pageQuery, tab }: { pageQuery: string; tab: string }) => {
  const navigate = useNavigate();
  const { control, watch } = useForm<FieldValues>({ mode: "onChange" });
  const user = setUser((v) => v.user);
  const { data, isLoading, isNext, page, setSearch, setPage } =
    useProduct().find(user?.id ?? "", Number(pageQuery));

  useSetSearch(watch("search"), setSearch);

  const onNext = () => setPage((v) => v + 1);
  const onPrev = () => setPage((v) => v - 1);
  const qs = stringifyQuery({ page, tab });

  React.useEffect(() => {
    navigate(`/produk?${qs}`);
  }, [qs]);

  const { actionIsConfirm } = useActiveModal();
  const { columns, id, isSuspend, product } = useHook();
  const { update } = useProduct(id);

  const onSuspend = async () => {
    if (!product) return;

    try {
      const data = {
        category: {
          categoryId: product.categoryProduct.category.id,
        },
        deliveryPrice: product.deliveryPrice,
        description: product.description,
        isAvailable: !isSuspend,
        isDangerous: product.isDangerous,
        name: product.name,
        price: product.price,
        subCategoryId: product.subCategoryProductId,
      };

      await update.mutateAsync({ data });
      toast.success(isSuspend ? "Produk dinon-aktifkan" : "Produk diaktifkan");
      actionIsConfirm();
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to non-active the product: ${error.message}`);
      console.error(`Failed to non-active the product: ${error.message}`);
    }
  };

  return (
    <>
      <TableWithSearchAndTabs
        columns={columns}
        control={control}
        isLoading={isLoading}
        data={data?.items ?? []}
        page={page}
        placeholder="cari nama produk/kategori/Sub-Kategori"
        className="whitespace-nowrap overflow-y-auto h-calcProductTable mb-4"
      />

      <Pagination page={page} isNext={isNext} next={onNext} prev={onPrev} />

      <ConfirmModal
        label={
          isSuspend
            ? "Yakin ingin menonaktifkan produk ini?"
            : "Yakin ingin mengaktifkan produk ini?"
        }
        onSubmit={{
          label: isSuspend ? "non-aktifkan" : "aktifkan",
          action: onSuspend,
        }}
      />
    </>
  );
};

const useHook = () => {
  const navigate = useNavigate();
  const { id, isSuspend, onSwitch: onTriggerSwitch } = useSuspend();
  const [product, setProduct] = React.useState<Product>();

  const onSwitch = (
    productId: string,
    isSuspendData: boolean,
    product: Product
  ) => {
    setProduct(product);
    onTriggerSwitch(productId, isSuspendData);
  };

  const columns: Columns<Product>[] = [
    {
      header: <p className="text-center">nama produk</p>,
      render: (v) => <p className="truncate">{v.name}</p>,
      width: "max-w-[10rem]",
    },
    {
      header: <p className="text-center">kategori</p>,
      render: (v) => (
        <p className="truncate">{v.categoryProduct.category.name}</p>
      ),
      width: "max-w-[10rem]",
    },
    {
      header: <p className="text-right">harga (Rp)</p>,
      render: (v) => <LabelPrice product={v} label="" className="text-right" />,
      width: "max-w-[10rem] lg:max-w-[8rem]",
    },
    {
      header: <p className="text-center">diskon</p>,
      render: (v) => (
        <p className="truncate text-right">
          {Currency(v.price.priceDiscount ?? 0)}
        </p>
      ),
      width: "min-w-[6rem]",
    },
    {
      header: <p className="text-center">periode</p>,
      render: (v) => (
        <Label
          label={
            !v.price.startAt
              ? "-"
              : `${epochToDateConvert(v.price.startAt)} - ${epochToDateConvert(
                  v.price.expiredAt
                )}`
          }
        />
      ),
      width: "min-w-[6rem]",
    },
    {
      header: <p className="text-center">tanggal dibuat</p>,
      render: (v) => <Label label={epochToDateConvert(v.createdAt)} />,
      width: "max-w-[6rem]",
    },
    {
      header: <p className="text-center">aksi</p>,
      render: (v, idx) => (
        <Actions
          action="both"
          id={idx}
          detail={{ onClick: () => navigate(`/produk/${v.id}`) }}
          switch={{
            isSelected: v.isAvailable,
            onClick: () => onSwitch(v.id, v.isAvailable, v),
          }}
        />
      ),
      width: "w-[10rem]",
    },
  ];

  return { columns, isSuspend, id, product };
};

export default SubProduct;
