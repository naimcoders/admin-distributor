import { useNavigate } from "react-router-dom";
import { Sales as ISales, findSales } from "src/api/sales.service";
import { Actions } from "src/components/Actions";
import Error from "src/components/Error";
import Label from "src/components/Label";
import Pagination from "src/components/Pagination";
import { TableWithoutTabs } from "src/components/Table";
import {
  parsePhoneNumber,
  parseQueryString,
  stringifyQuery,
} from "src/helpers";
import { Columns } from "src/types";
import { useSuspend } from "../distributor/Index";
import { toast } from "react-toastify";
import { ConfirmModal } from "src/components/Modal";

// TODO:
// 1. sales activated

const Sales = () => {
  const navigate = useNavigate();
  const qString = parseQueryString<{ page: number }>();
  const setDetailQueryString = stringifyQuery({ tab: "profil" });
  const { data, isLoading, error, page, setSearch, setPage, isNext } =
    findSales(Number(qString.page));

  const { onSwitch, isSuspend, closeModal, id, onResetId, onResetSuspend } =
    useSuspend();

  const onSuspend = async () => {
    try {
      toast.loading("Loading...", { toastId: "activated-sales" });
      console.log({ id, isSuspend });

      toast.success("Status berhasil diperbarui");
      closeModal();
      onResetId();
      onResetSuspend();
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    } finally {
      toast.dismiss("activated-sales");
    }
  };

  const onNext = () => setPage((v) => v + 1);
  const onPrev = () => setPage((v) => v - 1);

  const columns: Columns<ISales>[] = [
    {
      header: <p className="text-center">nama sales</p>,
      render: (v) => <Label label={v.name} />,
    },
    {
      header: <p className="text-center">nomor HP</p>,
      render: (v) => <p>{parsePhoneNumber(v.phoneNumber)}</p>,
    },
    {
      header: <p className="text-center">email</p>,
      render: (v) => <p>{v.email}</p>,
    },
    {
      header: <p className="text-center">tanggal join</p>,
      render: (v) => <p>{v.createdAt}</p>,
    },
    {
      header: <p className="text-center">kategori sales</p>,
      render: (v) => (
        <p className="truncate normal-case">
          {v.category.map((e) => e.name).join(", ")}
        </p>
      ),
      width: "max-w-[2rem]",
    },
    {
      header: <p className="text-center">kategori sales</p>,
      render: (v) => <p className="text-right">{v.comition}%</p>,
    },
    {
      header: <p className="text-center">omset bulan ini</p>,
      render: (v) => <p className="text-right">{v.revenue}</p>,
    },
    {
      header: <p className="text-center">aksi</p>,
      render: (v, idx) => (
        <Actions
          id={idx}
          action="switchAndDetail"
          switch={{
            isSelected: !v.isActive,
            onClick: () => onSwitch(v.id, v.isActive),
          }}
          detail={{
            onClick: () => navigate(`/sales/${v.id}?${setDetailQueryString}`),
          }}
        />
      ),
      width: "w-40",
    },
  ];

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : (
        <main className="overflow-auto whitespace-nowrap pb-5">
          <TableWithoutTabs
            header={{
              search: {
                placeholder: "cari nama sales/nomor HP/kategori",
                setSearch,
              },
              createData: {
                isValue: true,
                label: "sales",
                onClick: () => navigate("/sales/tambah"),
              },
            }}
            table={{
              columns,
              data: data?.items ?? [],
              isLoading,
              page,
              className:
                "mb-4 overflow-auto whitespace-nowrap h-calcSubDistributorTable",
            }}
          />

          <Pagination page={page} next={onNext} prev={onPrev} isNext={isNext} />

          <ConfirmModal
            label={
              !isSuspend
                ? "Yakin ingin menonaktifkan akun ini?"
                : "Yakin ingin mengaktifkan akun ini?"
            }
            onSubmit={{
              label: !isSuspend ? "non-aktifkan" : "aktifkan",
              action: onSuspend,
            }}
          />
        </main>
      )}
    </>
  );
};

export default Sales;
