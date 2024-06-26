import { FieldValues, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Product as IProduct, useProduct } from "src/api/product.service";
import { Actions } from "src/components/Actions";
import Label, { LabelPrice } from "src/components/Label";
import Pagination from "src/components/Pagination";
import { TableWithSearchAndTabs } from "src/components/Table";
import {
  epochToDateConvert,
  parseQueryString,
  useSetSearch,
} from "src/helpers";
import { Columns } from "src/types";

interface ProductProps {
  distributorId: string;
}

const Product = ({ distributorId }: ProductProps) => {
  const { columns } = useHook();
  const { control, watch } = useForm<FieldValues>({ mode: "onChange" });
  const { page: pageQuery } = parseQueryString<{ page: string }>();
  const { find } = useProduct();
  const { data, isLoading, isNext, page, setSearch, setPage } = find(
    distributorId,
    Number(pageQuery)
  );

  useSetSearch(watch("search"), setSearch);
  const onNext = () => setPage((v) => v + 1);
  const onPrev = () => setPage((v) => v - 1);

  return (
    <main>
      <TableWithSearchAndTabs
        columns={columns}
        data={data?.items ?? []}
        control={control}
        isLoading={isLoading}
        placeholder="cari nama produk, kategori, sub-kategori"
        page={page}
        className="mb-4"
      />
      <Pagination next={onNext} prev={onPrev} page={page} isNext={isNext} />
    </main>
  );
};

const useHook = () => {
  const navigate = useNavigate();

  const columns: Columns<IProduct>[] = [
    {
      header: <p className="text-center">nama produk</p>,
      render: (v) => <Label label={v.name} />,
    },
    {
      header: <p className="text-center">kategori</p>,
      render: (v) => <Label label={v.categoryProduct.category.name} />,
    },
    {
      header: <p className="text-right">harga (Rp)</p>,
      render: (v) => (
        <LabelPrice product={v} label="" className="justify-end" />
      ),
    },
    {
      header: <p className="text-center">tanggal dibuat</p>,
      render: (v) => <Label label={epochToDateConvert(v.createdAt)} />,
    },
    {
      header: <p className="text-center">aksi</p>,
      render: (v, idx) => (
        <Actions
          action="switch-detail"
          id={idx}
          detail={{ onClick: () => navigate(`/produk/${v.id}`) }}
        />
      ),
      width: "w-40",
    },
  ];

  return { columns };
};

export default Product;
