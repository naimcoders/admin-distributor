import React from "react";
import { HiCheckBadge, HiXMark } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { Store, findStores } from "src/api/store.service";
import { Actions, FolderIcon } from "src/components/Actions";
import { Button } from "src/components/Button";
import Error from "src/components/Error";
import Label from "src/components/Label";
import { Modal } from "src/components/Modal";
import Pagination from "src/components/Pagination";
import Skeleton from "src/components/Skeleton";
import Table from "src/components/Table";
import { parsePhoneNumber, parseQueryString } from "src/helpers";
import { Columns, IconColor } from "src/types";

const Customer = (props: { salesId: string }) => {
  const [isDeleteStore, setIsDeleteStore] = React.useState(false);

  const navigate = useNavigate();
  const getQueryString = parseQueryString<{ page: number }>();

  const { data, error, isLoading, page, setPage, isNext } = findStores(
    Number(getQueryString.page),
    props.salesId
  );

  const onPrev = () => setPage((v) => v - 1);
  const onNext = () => setPage((v) => v + 1);

  const onActiveDeleteStoreModal = () => setIsDeleteStore((v) => !v);

  const columns: Columns<Store>[] = [
    {
      header: <p className="text-center">nama toko</p>,
      render: (v) => <Label label={v.storeName} />,
    },
    {
      header: <p className="text-center">nama pemilik</p>,
      render: (v) => (
        <Label
          label={v.ownerName}
          startContent={
            v.isVerify && <HiCheckBadge color="#006FEE" size={20} />
          }
        />
      ),
    },
    {
      header: <p className="text-center">nomor HP</p>,
      render: (v) => <Label label={parsePhoneNumber(v.phoneNumber)} />,
    },
    {
      header: <p className="text-center">aksi</p>,
      render: (v, idx) => (
        <Actions
          id={idx}
          render={
            <>
              <FolderIcon
                onClick={() =>
                  navigate(`/sales/${props.salesId}/pelanggan/${v.id}`)
                }
              />
              <HiXMark
                color={IconColor.red}
                size={22}
                className="cursor-pointer"
                title="Keluarkan toko"
                onClick={onActiveDeleteStoreModal}
              />
            </>
          }
        />
      ),
      width: "w-40",
    },
  ];

  return (
    <main className="mt-5">
      {error ? (
        <Error error={error} />
      ) : isLoading ? (
        <Skeleton />
      ) : (
        <Table
          columns={columns}
          data={data?.items ?? []}
          isLoading={false}
          page={page}
          className="mb-4"
        />
      )}

      <Pagination page={page} isNext={isNext} next={onNext} prev={onPrev} />

      <DeleteStoreModal
        isOpen={isDeleteStore}
        onClose={onActiveDeleteStoreModal}
      />
    </main>
  );
};

interface IDeleteStore {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteStoreModal = (props: IDeleteStore) => {
  const onYes = () => console.log("yes");
  const onNo = () => console.log("no");

  return (
    <Modal isOpen={props.isOpen} closeModal={props.onClose}>
      <section className="flex flex-col gap-4 mt-4 mb-3">
        <h2>Yakin ingin mengeluarkan toko ini dari daftar Pelanggan Sales?</h2>
        <div className="flex gap-4 justify-center mt-4">
          <Button onClick={onYes} label="Ya" />
          <Button onClick={onNo} label="Tidak" variant="flat" color="danger" />
        </div>
      </section>
    </Modal>
  );
};

export default Customer;
