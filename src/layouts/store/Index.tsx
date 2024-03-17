import Error from "src/components/Error";
import Label from "src/components/Label";
import Rating from "src/components/Rating";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { Store, useStore } from "src/api/store.service";
import { Actions } from "src/components/Actions";
import { TableWithoutTabs } from "src/components/Table";
import {
  detailNavigate,
  parsePhoneNumber,
  parseQueryString,
  stringifyQuery,
} from "src/helpers";
import { Columns } from "src/types";
import React from "react";
import { useNavigate } from "react-router-dom";

const Store = () => {
  const { columns } = useHook();
  const parsed = parseQueryString<{ page: string }>();
  const { data, isLoading, error, isNext, page, setSearch, setPage } =
    useStore().find(Number(parsed.page));

  const navigate = useNavigate();
  const onPrev = () => setPage((num) => num - 1);
  const onNext = () => setPage((num) => num + 1);

  const qs = stringifyQuery({ page });
  React.useEffect(() => {
    navigate(`/toko?${qs}`);
  }, [qs]);

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : (
        <TableWithoutTabs
          header={{
            search: {
              placeholder: "cari nama toko/pemilik/no HP/PIC Sales",
              setSearch,
            },
          }}
          table={{
            columns,
            data: data?.items ?? [],
            isLoading: isLoading,
            isNext,
            page,
            next: onNext,
            prev: onPrev,
          }}
        />
      )}
    </>
  );
};

const useHook = () => {
  const { onNav } = detailNavigate();

  const columns: Columns<Store>[] = [
    {
      header: <p className="text-center">nama toko</p>,
      render: (v) => <Label label={v.storeName} />,
    },
    {
      header: <p className="text-center">rating</p>,
      render: (v) => <Rating rate={v.rate} />,
    },
    {
      header: <p className="text-center">nama pemilik</p>,
      render: (v) => (
        <Label
          label={v.ownerName}
          startContent={
            v.isVerify && <CheckBadgeIcon color="#006FEE" width={16} />
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
          detail={{
            onClick: () => onNav(String(v.id)),
          }}
        />
      ),
      width: "w-40",
    },
  ];

  return { columns };
};

export default Store;
