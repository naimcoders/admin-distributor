import React from "react";
import Error from "src/components/Error";
import Label from "src/components/Label";
import {
  Distributor as IDistributor,
  suspendDistributor,
  useDistributor,
} from "src/api/distributor.service";
import { Actions } from "src/components/Actions";
import { TableWithoutTabs } from "src/components/Table";
import {
  epochToDateConvert,
  parsePhoneNumber,
  parseQueryString,
  stringifyQuery,
} from "src/helpers";
import { Columns } from "src/types";
import { ConfirmModal } from "src/components/Modal";
import { useNavigate } from "react-router-dom";
import { useActiveModal } from "src/stores/modalStore";
import Skeleton from "src/components/Skeleton";
import Pagination from "src/components/Pagination";
import { toast } from "react-toastify";

export const useSuspend = () => {
  const [isSuspend, setIsSuspend] = React.useState(false);
  const [id, setId] = React.useState("");

  const { actionIsConfirm } = useActiveModal();
  const onResetSuspend = () => setIsSuspend(false);
  const onResetId = () => setId("");

  const onSwitch = (id: string, isSuspendData: boolean) => {
    setIsSuspend(isSuspendData);
    setId(id);
    actionIsConfirm();
  };

  return {
    id,
    isSuspend,
    onResetSuspend,
    onSwitch,
    onResetId,
    closeModal: actionIsConfirm,
  };
};

const Distributor = () => {
  const navigate = useNavigate();
  const { page: pageQuery } = parseQueryString<{ page: string }>();

  const { find } = useDistributor();
  const { data, isLoading, error, page, setPage, isNext, setSearch } = find(
    Number(pageQuery)
  );
  const { mutateAsync } = suspendDistributor();

  const qs = stringifyQuery({ page });
  const qsToDetail = stringifyQuery({ tab: "profil" });
  React.useEffect(() => {
    navigate(`/sub-distributor?${qs}`);
  }, [qs]);

  const prev = () => setPage((num) => num - 1);
  const next = () => setPage((num) => num + 1);

  const { onSwitch, isSuspend, closeModal, id, onResetId, onResetSuspend } =
    useSuspend();

  const onSuspend = async () => {
    try {
      toast.loading("Loading...", { toastId: "loading-suspend" });
      await mutateAsync({ id, isSuspend: !isSuspend });
      toast.success("Status berhasil diperbarui");
      closeModal();
      onResetId();
      onResetSuspend();
    } catch (e) {
      const error = e as Error;
      toast.error(error.message);
    } finally {
      toast.dismiss("loading-suspend");
    }
  };

  const columns: Columns<IDistributor>[] = [
    {
      header: <p className="text-center">nama pemilik</p>,
      render: (v) => <Label label={v.ownerName} />,
    },
    {
      header: <p className="text-center">nomor HP</p>,
      render: (v) => <Label label={parsePhoneNumber(v.phoneNumber)} />,
    },
    {
      header: <p className="text-center">email</p>,
      render: (v) => <Label label={v.email} />,
    },
    {
      header: <p className="text-center">tanggal join</p>,
      render: (v) => <Label label={epochToDateConvert(v.createdAt)} />,
    },
    {
      header: <p className="text-center">aksi</p>,
      render: (v, idx) => (
        <Actions
          id={idx}
          action="switchAndDetail"
          switch={{
            isSelected: !v.isSuspend,
            onClick: () => onSwitch(v.id, v.isSuspend),
          }}
          detail={{
            onClick: () => navigate(`/sub-distributor/${v.id}?${qsToDetail}`),
          }}
        />
      ),
      width: "w-40",
    },
  ];

  return (
    <section>
      {error ? (
        <Error error={error} />
      ) : isLoading ? (
        <Skeleton />
      ) : (
        <main className="whitespace-nowrap overflow-auto pb-5">
          <TableWithoutTabs
            header={{
              search: {
                placeholder: "cari nama sub-distributor/pemilik/no HP",
                setSearch,
              },
              createData: {
                isValue: true,
                label: "sub distributor",
                onClick: () => navigate("/sub-distributor/tambah"),
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

          <Pagination page={page} next={next} prev={prev} isNext={isNext} />

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
    </section>
  );
};

export default Distributor;
