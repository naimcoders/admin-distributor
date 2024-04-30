import { ArrowDownTrayIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { DocumentChartBarIcon } from "@heroicons/react/24/solid";
import { Chip, Spinner } from "@nextui-org/react";
import cx from "classnames";
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
  parsePhoneNumber,
  uppercaseToCapitalize,
} from "src/helpers";

const status: { eng: string; ina: string }[] = [
  { eng: "PENDING", ina: "Pending" },
  { eng: "WAITING_ACCEPT", ina: "Menunggu konfirmasi" },
  { eng: "ACCEPT", ina: "Pesanan diproses" },
  { eng: "DELIVERY", ina: "Pengiriman" },
  { eng: "COMPLETE", ina: "Selesai" },
  { eng: "REJECT", ina: "Batal" },
  { eng: "ITEM_READY", ina: "Diantar kurir" },
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

          <section className="bg-white rounded-lg px-5">
            <section className="text-sm py-5 grid-min-300 gap-6 border-b border-gray-300">
              <section className="flex flex-col gap-2">
                <h1 className="font-medium capitalize">ID Order</h1>
                <p>{data?.id}</p>
              </section>
              <section className="flex flex-col gap-2">
                <h1 className="font-medium capitalize">tanggal order</h1>
                <p>{epochToDateConvert(data?.createdAt)}</p>
              </section>
              <section className="flex flex-col gap-2">
                <h1 className="font-medium capitalize">status order</h1>
                <p className={cx("capitalize ", `text-[#fcb230]`)}>
                  {status.map((v) => data?.status === v.eng && v.ina)}
                </p>
              </section>
              <section className="flex flex-col gap-2">
                <h1 className="font-medium capitalize">tanggal diterima</h1>
              </section>
            </section>

            {/*  */}

            <section className="text-sm py-5 grid-min-300 gap-6 border-b border-gray-300">
              <section className="flex flex-col gap-2">
                <h1 className="font-medium capitalize">pemesan</h1>
                <section className="flex gap-2">
                  <img src={pemesanImg} alt="Order Image" className="w-6 h-6" />
                  <div>
                    <h2 className="font-medium">{data?.customer.name}</h2>
                    <p>{parsePhoneNumber(data?.customer.phoneNumber)}</p>
                  </div>
                </section>
              </section>
              <section className="flex flex-col gap-2">
                <h1 className="font-medium capitalize">nama toko</h1>
                <p>-</p>
              </section>
              <section className="flex flex-col gap-2">
                <h1 className="font-medium capitalize">alamat pengiriman</h1>
                <p className="capitalize ">{data?.customer.address}</p>
              </section>
              <section className="flex flex-col gap-2">
                <h1 className="font-medium capitalize">catatan pengiriman</h1>
                <p>{data?.note}</p>
              </section>
            </section>

            {/*  */}

            <div className="overflow-auto whitespace-nowrap border-b border-gray-300 py-5">
              <section className="text-sm flex gap-2 md:grid md:grid-cols-4">
                <h1 className="font-medium capitalize">jenis pesanan</h1>
                <h1 className="font-medium capitalize">sub-distributor</h1>
                <h1 className="font-medium capitalize text-right">
                  unit harga (Rp)
                </h1>
                <h1 className="font-medium capitalize text-right">
                  subtotal (Rp)
                </h1>

                {/* ITEMS */}
                {data?.items.map((product, idx) => (
                  <section
                    className="flex flex-col gap-2 col-span-4"
                    key={`${idx}-${product.product.name}`}
                  >
                    <section className="grid grid-cols-4 gap-2">
                      <h2>{product.product.name}</h2>
                      <h2>-</h2>
                      <h2 className="text-right">
                        {Currency(product.product.price.price)}
                      </h2>
                      <h2 className="text-right">
                        {Currency(
                          calculateSubTotal(
                            product.product.price.price,
                            product.qty
                          )
                        )}
                      </h2>
                    </section>

                    {product.note && (
                      <div className="flex gap-1 text-xs bg-green-200 text-green-500 font-medium px-3 py-2 rounded-md">
                        <DocumentChartBarIcon width={15} />
                        {product.note}
                      </div>
                    )}
                  </section>
                ))}

                <section className="font-medium flex justify-between col-span-4 mt-3">
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
                    {uppercaseToCapitalize(data?.invoice.paymentMethod ?? "")}
                  </h2>
                </section>
              </section>
            </div>

            {/*  */}

            <section className="text-sm grid grid-cols-4 gap-6 border-b border-gray-300 py-5">
              <section className="flex flex-col gap-2 col-span-1">
                <h1 className="font-medium capitalize">kurir</h1>
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
                <h1 className="font-medium capitalize">PIC sales</h1>
                <p>-</p>
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
                    label="tandai pesanan siap dikirim"
                    className="w-max"
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
      await mutateAsync();
      toast.success("Order berhasil diterima");
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to accept the order: ${error.message}`);
      console.error(`Failed to accept the order: ${error.message}`);
    }
  };

  return { onAccept, isLoadingAccept: isPending };
};

const useItemReady = (orderId: string) => {
  const { mutateAsync, isPending } = itemReadyOrder(orderId);

  const onItemReady = async () => {
    try {
      await mutateAsync();
      toast.success("Pesanan siap dikirim");
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to submit the item ready: ${error.message}`);
    }
  };

  return { onItemReady, isLoadingItemReady: isPending };
};

const useReject = (orderId: string) => {
  const { mutateAsync, isPending } = rejectOrder(orderId);

  const onReject = async () => {
    try {
      await mutateAsync();
      toast.success("Order berhasil ditolak");
    } catch (e) {
      const error = e as Error;
      toast.error(`Failed to reject the order: ${error.message}`);
    }
  };

  return { onReject, isLoadingReject: isPending };
};

export default Detail;
