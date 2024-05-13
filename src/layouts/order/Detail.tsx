import cx from "classnames";
import {
  ArrowDownTrayIcon,
  ClipboardIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";
import { DocumentChartBarIcon } from "@heroicons/react/24/outline";
import { Chip, Spinner } from "@nextui-org/react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  acceptOrder,
  findOrderById,
  itemReadyOrder,
  rejectOrder,
} from "src/api/order.service";
import pemesanImg from "src/assets/images/pemesan.png";
import { Button } from "src/components/Button";
import Error from "src/components/Error";
import Skeleton from "src/components/Skeleton";
import {
  Currency,
  epochToDateConvert,
  onClipboard,
  parsePhoneNumber,
  uppercaseToCapitalize,
} from "src/helpers";
import { IconColor } from "src/types";
import React from "react";

export const statusOrder: { eng: string; ina: string }[] = [
  { eng: "PENDING", ina: "Pending" },
  { eng: "WAITING_ACCEPT", ina: "Menunggu konfirmasi" },
  { eng: "ACCEPT", ina: "Pesanan diproses" },
  { eng: "DELIVERY", ina: "Pengiriman" },
  { eng: "COMPLETE", ina: "Selesai" },
  { eng: "REJECT", ina: "Batal" },
  { eng: "ITEM_READY", ina: "Menunggu Kurir" },
  { eng: "VERIFY_PIN", ina: "Verifikasi PIN" },
];

const calculateSubTotal = (price: number, qty: number) => price * qty;

const Print = () => {
  return (
    <section className="flex gap-2 cursor-pointer">
      <PrinterIcon width={18} />
      Print
    </section>
  );
};

const Download = () => {
  return (
    <section className="flex gap-2 cursor-pointer">
      <ArrowDownTrayIcon width={18} />
      Download
    </section>
  );
};

const Detail = () => {
  const { orderId } = useParams() as { orderId: string };
  const { error, isLoading, data } = findOrderById(orderId);
  const { onAccept, isLoadingAccept } = useAccept(orderId);
  const { onReject, isLoadingReject } = useReject(orderId);
  const { onItemReady, isLoadingItemReady } = useItemReady(orderId);

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : isLoading ? (
        <Skeleton />
      ) : (
        <main className="flex flex-col gap-4">
          <section className="flex gap-6 justify-end">
            <Print />
            <Download />
          </section>

          <section className="bg-white rounded-lg px-5 mb-4">
            <section className="text-sm py-5 grid-min-300 gap-6 border-b border-gray-300">
              <section className="flex flex-col gap-2">
                <h1 className="font-medium inline-flex gap-2">
                  ID Order{" "}
                  <ClipboardIcon
                    width={18}
                    color={IconColor.zinc}
                    className="cursor-pointer"
                    title="Salin"
                    onClick={() => onClipboard(data?.id ?? "")}
                  />
                </h1>
                <p>{data?.id}</p>
              </section>
              <section className="flex flex-col gap-2">
                <h1 className="font-medium">Tanggal Order</h1>
                <p>{epochToDateConvert(data?.createdAt)}</p>
              </section>
              <section className="flex flex-col gap-2">
                <h1 className="font-medium">Status Order</h1>
                {statusOrder.map(
                  (v) =>
                    data?.status === v.eng && (
                      <p
                        className={cx(
                          `text-[#fcb230]`,
                          v.eng === "COMPLETE" && "text-green-500"
                        )}
                        key={v.eng}
                      >
                        {v.ina}
                      </p>
                    )
                )}
              </section>
              <section className="flex flex-col gap-2">
                <h1 className="font-medium">Tanggal Diterima</h1>
              </section>
            </section>

            {/*  */}

            <section className="text-sm py-5 grid-min-300 gap-6 border-b border-gray-300">
              <section className="flex flex-col gap-2">
                <h1 className="font-medium">Pemesan</h1>
                <section className="flex gap-2">
                  <img src={pemesanImg} alt="Order Image" className="w-6 h-6" />
                  <div>
                    <h2 className="font-medium">{data?.customer.name}</h2>
                    <p>{parsePhoneNumber(data?.customer.phoneNumber)}</p>
                  </div>
                </section>
              </section>
              <section className="flex flex-col gap-2">
                <h1 className="font-medium">Nama Toko</h1>
                <p>-</p>
              </section>
              <section className="flex flex-col gap-2">
                <h1 className="font-medium">Alamat Pengiriman</h1>
                <p>{data?.customer.address}</p>
              </section>
              <section className="flex flex-col gap-2">
                <h1 className="font-medium">Catatan Pengiriman</h1>
                <p>{data?.note}</p>
              </section>
            </section>

            {/*  */}

            <section className="border-b border-gray-300 py-5 text-sm overflow-x-auto">
              <section className="grid grid-cols-4 gap-4 text-xs sm:text-sm">
                <h1 className="font-medium">Jenis Pesanan</h1>
                <h1 className="font-medium">Sub-Distributor</h1>
                <h1 className="font-medium text-right">Unit Harga (Rp)</h1>
                <h1 className="font-medium text-right">Subtotal (Rp)</h1>
              </section>

              <section className="grid grid-cols-4 gap-2 mt-2">
                {data?.items.map((product, idx) => (
                  <React.Fragment key={idx}>
                    <h2 title={product.product.name}>{product.product.name}</h2>
                    <h2>-</h2>
                    <h2 className="text-right truncate">
                      {Currency(product.product.price.price)}
                    </h2>
                    <h2 className="text-right truncate">
                      {Currency(
                        calculateSubTotal(
                          product.product.price.price,
                          product.qty
                        )
                      )}
                    </h2>

                    {product.note && (
                      <div className="flex gap-1 text-sm bg-gray-200 px-3 py-2 rounded-md col-span-4">
                        <DocumentChartBarIcon width={15} />
                        {product.note}
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </section>

              <section className="text-sm grid grid-cols-4 gap-2 mt-4">
                <section className="font-medium flex justify-between col-span-4">
                  <h2>Total Harga</h2>
                  <p>{Currency(data?.price.totalPriceItems ?? 0)}</p>
                </section>
                <section className="flex justify-between col-span-4">
                  <h2>Biaya Pengiriman</h2>
                  <p>{Currency(data?.delivery.price ?? 0)}</p>
                </section>
                <section className="flex justify-between col-span-4">
                  <h2>Biaya Lainnya</h2>
                  <p>{Currency(data?.price.feeApp ?? 0)}</p>
                </section>
                <section className="flex justify-between col-span-4">
                  <h2>Diskon</h2>
                  <p>{Currency(data?.price.discount ?? 0)}</p>
                </section>
                <section className="font-medium flex justify-between col-span-4 mt-3">
                  <h2>Total Pembayaran</h2>
                  <p>{Currency(data?.invoice.totalPrice ?? 0)}</p>
                </section>
                <section className="flex justify-between col-span-4">
                  <h2>
                    Metode Pembayaran{" "}
                    {uppercaseToCapitalize(
                      data?.invoice.paymentType.split("_").join(" ") ?? ""
                    )}{" "}
                    {data?.invoice.paymentMethod.split("_").join(" ")}
                  </h2>
                </section>
              </section>
            </section>

            {/*  */}

            <section className="text-sm grid grid-cols-4 gap-6 border-b border-gray-300 py-5">
              <section className="flex flex-col gap-2 col-span-1">
                <h1 className="font-medium">Kurir</h1>
                {!data?.delivery.courier ? (
                  "-"
                ) : (
                  <>
                    <p>{data?.delivery.courier.name}</p>
                    <p>
                      {parsePhoneNumber(data?.delivery.courier.phoneNumber)}
                    </p>
                  </>
                )}
              </section>
              <section className="flex flex-col gap-2">
                <h1 className="font-medium">PIC Sales</h1>
                <p>-</p>
              </section>
            </section>

            <section className="py-5">
              {data?.status === "ITEM_READY" && (
                <Chip color="primary" size="md" variant="flat">
                  Menunggu konfirmasi kurir
                </Chip>
              )}

              {data?.status === "WAITING_ACCEPT" && (
                <div className="flex lg:gap-5 gap-4 justify-center md:justify-end ">
                  <Button
                    label={
                      isLoadingReject ? <Spinner color="danger" /> : "tolak"
                    }
                    className="bg-transparent text-[#F31260] border border-[#F31260]"
                    onClick={onReject}
                  />

                  <Button
                    label={
                      isLoadingAccept ? (
                        <Spinner color="secondary" size="sm" />
                      ) : (
                        "terima 59:59"
                      )
                    }
                    onClick={onAccept}
                  />
                </div>
              )}

              {data?.status === "ACCEPT" && (
                <div className="flex justify-end">
                  <Button
                    label={
                      isLoadingItemReady ? (
                        <Spinner color="secondary" size="sm" />
                      ) : (
                        "tandai pesanan siap dikirim"
                      )
                    }
                    className="w-max"
                    onClick={onItemReady}
                  />
                </div>
              )}
            </section>
          </section>
        </main>
      )}
    </>
  );
};

const useAccept = (orderId: string) => {
  const { mutateAsync, isPending } = acceptOrder(orderId);

  const onAccept = async () => {
    try {
      toast.loading("Loading...", { toastId: "loading-accept" });
      await mutateAsync();
      toast.success("Order berhasil diterima");
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to accept: ${error.message}`);
    } finally {
      toast.dismiss("loading-accept");
    }
  };

  return { onAccept, isLoadingAccept: isPending };
};

const useItemReady = (orderId: string) => {
  const { mutateAsync, isPending } = itemReadyOrder(orderId);

  const onItemReady = async () => {
    try {
      toast.loading("Loading...", { toastId: "loading-item-ready" });
      await mutateAsync();
      toast.success("Pesanan siap dikirim");
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to submit: ${error.message}`);
    } finally {
      toast.dismiss("loading-item-ready");
    }
  };

  return { onItemReady, isLoadingItemReady: isPending };
};

const useReject = (orderId: string) => {
  const { mutateAsync, isPending } = rejectOrder(orderId);

  const onReject = async () => {
    try {
      toast.loading("Loading...", { toastId: "loading-reject" });
      await mutateAsync();
      toast.success("Order berhasil ditolak");
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to reject: ${error.message}`);
    } finally {
      toast.dismiss("loading-reject");
    }
  };

  return { onReject, isLoadingReject: isPending };
};

export default Detail;
