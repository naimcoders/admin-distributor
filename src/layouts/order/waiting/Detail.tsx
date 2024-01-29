import cx from "classnames";
import pemesanImg from "src/assets/images/pemesan.png";
import { Button } from "src/components/Button";

const Detail = () => {
  return (
    <main className="bg-white rounded-lg px-5">
      <section className="text-sm py-5 grid-min-300 gap-6 border-b border-gray-300">
        <section className="flexcol gap-2">
          <h1 className="font-interBold capitalize">ID Order</h1>
          <p className="font-interMedium">OR 12345</p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-interBold capitalize">tanggal order</h1>
          <p className="font-interMedium">2 Desember 2023, 10:13</p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-interBold capitalize">status order</h1>
          <p className={cx("capitalize font-interMedium", `text-[#fcb230]`)}>
            menunggu konfirmasi
          </p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-interBold capitalize">tanggal diterima</h1>
        </section>
      </section>

      {/*  */}

      <section className="text-sm py-5 grid-min-300 gap-6 border-b border-gray-300">
        <section className="flexcol gap-2">
          <h1 className="font-interBold capitalize">pemesan</h1>
          <section className="flex gap-2">
            <img src={pemesanImg} alt="Order Image" className="w-6 h-6" />
            <div>
              <h2 className="font-interBold">Arif Kurniawan</h2>
              <p className="font-interMedium">081122334456</p>
            </div>
          </section>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-interBold capitalize">nama toko</h1>
          <p className="font-interMedium">Agung Jaya</p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-interBold capitalize">alamat pengiriman</h1>
          <p className="capitalize font-interMedium">
            Jl. Pongtiku No. 123 (Depan SMPN 4), Tallo, Kota Makassar, Sulawesi
            Selatan, 90214
          </p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-interBold capitalize">catatan pengiriman</h1>
          <p className="font-interMedium">Ruko warna biru di sisi kiri jalan</p>
        </section>
      </section>

      {/*  */}

      <div className="overflow-auto whitespace-nowrap border-b border-gray-300 py-5">
        <section className="text-sm flex gap-6 md:grid md:grid-cols-4">
          <section className="flexcol gap-4">
            <section className="flexcol gap-2">
              <h1 className="font-interBold capitalize">jenis pesanan</h1>
              <p className="font-interMedium">4 x Beras Lahap 5 kg</p>
              <p className="font-interMedium">2 x Minyak Goreng Bimoli 5 L</p>
            </section>

            <section className="flexcol gap-2">
              <h1 className="font-interBold capitalize">total harga</h1>
              <p className="font-interMedium capitalize">biaya pengiriman</p>
              <p className="font-interMedium capitalize">biaya lainnya</p>
              <p className="font-interMedium capitalize">diskon</p>
            </section>

            <section className="flexcol gap-2">
              <h1 className="font-interBold capitalize">total pembayaran</h1>
              <p className="font-interMedium">Metode Pembayaran VA Mandiri</p>
            </section>
          </section>

          <section className="flexcol gap-2">
            <h1 className="font-interBold capitalize">sub-distributor</h1>
            <p className="font-interMedium">Bintang Terang</p>
            <p className="font-interMedium">Semeru</p>
          </section>
          <section className="flexcol gap-2 w-max text-right">
            <h1 className="font-interBold capitalize">unit harga (Rp)</h1>
            <p className="font-interMedium">80.000</p>
            <p className="font-interMedium">130.000</p>
          </section>

          <section className="flexcol gap-4 w-max text-right pr-5">
            <section className="flexcol gap-2">
              <h1 className="font-interBold capitalize">subtotal (Rp)</h1>
              <p className="font-interMedium">320.000</p>
              <p className="font-interMedium">260.000</p>
            </section>

            <section className="flexcol gap-2">
              <p className="font-interBold">580.000</p>
              <p className="font-interMedium">0</p>
              <p className="font-interMedium">5.000</p>
              <p className="font-interMedium">0</p>
            </section>

            <p className="font-interBold">585.000</p>
          </section>
        </section>
      </div>

      {/*  */}

      <section className="text-sm grid grid-cols-4 gap-6 border-b border-gray-300 py-5">
        <section className="flexcol gap-2 col-span-1">
          <h1 className="font-interBold capitalize">kurir</h1>
          <p className="font-interMedium">JNE Cargo</p>
          <p className="font-interMedium">081123456789</p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-interBold capitalize">PIC sales</h1>
          <p className="font-interMedium">Cahyo</p>
          <p className="font-interMedium">08157788499</p>
        </section>
      </section>

      <section className="py-5 flex gap-5 justify-end">
        <Button
          aria-label="tolak"
          variant="bordered"
          color="danger"
          className="font-interMedium"
        />
        <Button aria-label="terima 59:59" />
      </section>
    </main>
  );
};

export default Detail;
