import { HiCheckBadge } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { Store, findStores } from "src/api/store.service";
import { Actions } from "src/components/Actions";
import Error from "src/components/Error";
import Label from "src/components/Label";
import Pagination from "src/components/Pagination";
import Skeleton from "src/components/Skeleton";
import Table from "src/components/Table";
import { parsePhoneNumber, parseQueryString } from "src/helpers";
import { Columns } from "src/types";

const Customer = (props: { salesId: string }) => {
  const navigate = useNavigate();
  const getQueryString = parseQueryString<{ page: number }>();

  const { data, error, isLoading, page, setPage, isNext } = findStores(
    Number(getQueryString.page),
    props.salesId
  );

  const onPrev = () => setPage((v) => v - 1);
  const onNext = () => setPage((v) => v + 1);

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
          action="detail"
          detail={{ onClick: () => navigate(`pelanggan/${v.id}`) }}
        />
      ),
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
        />
      )}

      <Pagination page={page} isNext={isNext} next={onNext} prev={onPrev} />
    </main>
  );
};

export default Customer;
