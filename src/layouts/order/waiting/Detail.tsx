import { DocumentChartBarIcon } from "@heroicons/react/24/solid";
import cx from "classnames";
import pemesanImg from "src/assets/images/pemesan.png";
import { Button } from "src/components/Button";

const Detail = () => {
  return (
    <main className="bg-white rounded-lg px-5">
      <section className="text-sm py-5 grid-min-300 gap-6 border-b border-gray-300">
        <section className="flexcol gap-2">
          <h1 className="font-medium capitalize">ID Order</h1>
          <p>OR 12345</p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-medium capitalize">tanggal order</h1>
          <p>2 Desember 2023, 10:13</p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-medium capitalize">status order</h1>
          <p className={cx("capitalize ", `text-[#fcb230]`)}>
            menunggu konfirmasi
          </p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-medium capitalize">tanggal diterima</h1>
        </section>
      </section>

      {/*  */}

      <section className="text-sm py-5 grid-min-300 gap-6 border-b border-gray-300">
        <section className="flexcol gap-2">
          <h1 className="font-medium capitalize">pemesan</h1>
          <section className="flex gap-2">
            <img src={pemesanImg} alt="Order Image" className="w-6 h-6" />
            <div>
              <h2 className="font-medium">Arif Kurniawan</h2>
              <p>081122334456</p>
            </div>
          </section>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-medium capitalize">nama toko</h1>
          <p>Agung Jaya</p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-medium capitalize">alamat pengiriman</h1>
          <p className="capitalize ">
            Jl. Pongtiku No. 123 (Depan SMPN 4), Tallo, Kota Makassar, Sulawesi
            Selatan, 90214
          </p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-medium capitalize">catatan pengiriman</h1>
          <p>Ruko warna biru di sisi kiri jalan</p>
        </section>
      </section>

      {/*  */}

      <div className="overflow-auto whitespace-nowrap border-b border-gray-300 py-5">
        <section className="text-sm flex gap-2 md:grid md:grid-cols-4">
          <h1 className="font-medium capitalize">jenis pesanan</h1>
          <h1 className="font-medium capitalize">sub-distributor</h1>
          <h1 className="font-medium capitalize text-right">unit harga (Rp)</h1>
          <h1 className="font-medium capitalize text-right">subtotal (Rp)</h1>

          <section className="flex flex-col gap-2 col-span-4">
            <section className="grid grid-cols-4 gap-2">
              <h2>4 x Beras Lahap 5 Kg</h2>
              <h2>Bintang Terang</h2>
              <h2 className="text-right">80.000</h2>
              <h2 className="text-right">320.000</h2>
            </section>
            <div className="flex gap-1 text-xs bg-green-200 text-green-500 font-medium px-3 py-2 rounded-md">
              <DocumentChartBarIcon width={15} />
              Tolong dipilihkan stok baru
            </div>
          </section>

          <section className="font-medium flex justify-between col-span-4">
            <h2>Total Harga</h2>
            <p>580.000</p>
          </section>
          <section className="flex justify-between col-span-4">
            <h2>Biaya Pengiriman</h2>
            <p>0</p>
          </section>
          <section className="flex justify-between col-span-4">
            <h2>Biaya Lainnya</h2>
            <p>5.000</p>
          </section>
          <section className="flex justify-between col-span-4">
            <h2>Diskon</h2>
            <p>0</p>
          </section>
          <section className="font-medium flex justify-between col-span-4">
            <h2>Total Pembayaran</h2>
            <p>585.000</p>
          </section>
          <section className="flex justify-between col-span-4">
            <h2>Metode Pembayaran VA Mandiri</h2>
          </section>
        </section>
      </div>

      {/*  */}

      <section className="text-sm grid grid-cols-4 gap-6 border-b border-gray-300 py-5">
        <section className="flex flex-col gap-2 col-span-1">
          <h1 className="font-medium capitalize">kurir</h1>
          <p className="">JNE Cargo</p>
          <p className="">081123456789</p>
        </section>
        <section className="flex flex-col gap-2">
          <h1 className="font-medium capitalize">PIC sales</h1>
          <p className="">Cahyo</p>
          <p className="">08157788499</p>
        </section>
      </section>

      <section className="py-5 flex gap-5 justify-end">
        <Button
          aria-label="tolak"
          className="bg-transparent text-[#F31260] border border-[#F31260]"
        />
        <Button aria-label="terima 59:59" />
      </section>
    </main>
  );
};

export default Detail;
