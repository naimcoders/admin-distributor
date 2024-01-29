import cx from "classnames";
import pemesanImg from "src/assets/images/pemesan.png";
import { Button } from "src/components/Button";

const Detail = () => {
  return (
    <main className="bg-white rounded-lg px-5">
      <section className="text-sm py-5 grid-min-300 gap-6 border-b border-gray-300">
        <section className="flexcol gap-2">
          <h1 className="font-interMedium capitalize">ID Order</h1>
          <p>OR 12345</p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-interMedium capitalize">tanggal order</h1>
          <p>2 Desember 2023, 10:13</p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-interMedium capitalize">status order</h1>
          <p className={cx("capitalize ", `text-[#fcb230]`)}>
            menunggu konfirmasi
          </p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-interMedium capitalize">tanggal diterima</h1>
        </section>
      </section>

      {/*  */}

      <section className="text-sm py-5 grid-min-300 gap-6 border-b border-gray-300">
        <section className="flexcol gap-2">
          <h1 className="font-interMedium capitalize">pemesan</h1>
          <section className="flex gap-2">
            <img src={pemesanImg} alt="Order Image" className="w-6 h-6" />
            <div>
              <h2 className="font-interMedium">Arif Kurniawan</h2>
              <p>081122334456</p>
            </div>
          </section>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-interMedium capitalize">nama toko</h1>
          <p>Agung Jaya</p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-interMedium capitalize">alamat pengiriman</h1>
          <p className="capitalize ">
            Jl. Pongtiku No. 123 (Depan SMPN 4), Tallo, Kota Makassar, Sulawesi
            Selatan, 90214
          </p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-interMedium capitalize">catatan pengiriman</h1>
          <p>Ruko warna biru di sisi kiri jalan</p>
        </section>
      </section>

      {/*  */}

      <div className="overflow-auto whitespace-nowrap border-b border-gray-300 py-5">
        <section className="text-sm flex gap-6 md:grid md:grid-cols-4">
          <section className="flexcol gap-4">
            <section className="flexcol gap-2">
              <h1 className="font-interMedium capitalize">jenis pesanan</h1>
              <p>4 x Beras Lahap 5 kg</p>
              <p>2 x Minyak Goreng Bimoli 5 L</p>
            </section>

            <section className="flexcol gap-2">
              <h1 className="font-interMedium capitalize">total harga</h1>
              <p className=" capitalize">biaya pengiriman</p>
              <p className=" capitalize">biaya lainnya</p>
              <p className=" capitalize">diskon</p>
            </section>

            <section className="flexcol gap-2">
              <h1 className="font-interMedium capitalize">total pembayaran</h1>
              <p>Metode Pembayaran VA Mandiri</p>
            </section>
          </section>

          <section className="flexcol gap-2">
            <h1 className="font-interMedium capitalize">sub-distributor</h1>
            <p>Bintang Terang</p>
            <p>Semeru</p>
          </section>
          <section className="flexcol gap-2 w-max text-right">
            <h1 className="font-interMedium capitalize">unit harga (Rp)</h1>
            <p>80.000</p>
            <p>130.000</p>
          </section>

          <section className="flexcol gap-4 w-max text-right pr-5">
            <section className="flexcol gap-2">
              <h1 className="font-interMedium capitalize">subtotal (Rp)</h1>
              <p>320.000</p>
              <p>260.000</p>
            </section>

            <section className="flexcol gap-2">
              <p className="font-interMedium">580.000</p>
              <p>0</p>
              <p>5.000</p>
              <p>0</p>
            </section>

            <p className="font-interMedium">585.000</p>
          </section>
        </section>
      </div>

      {/*  */}

      <section className="text-sm grid grid-cols-4 gap-6 border-b border-gray-300 py-5">
        <section className="flexcol gap-2 col-span-1">
          <h1 className="font-interMedium capitalize">kurir</h1>
          <p className="">JNE Cargo</p>
          <p className="">081123456789</p>
        </section>
        <section className="flexcol gap-2">
          <h1 className="font-interMedium capitalize">PIC sales</h1>
          <p className="">Cahyo</p>
          <p className="">08157788499</p>
        </section>
      </section>

      <section className="py-5 flex gap-5 justify-end">
        <Button
          aria-label="tolak"
          variant="bordered"
          color="danger"
          className=""
        />
        <Button aria-label="terima 59:59" />
      </section>
    </main>
  );
};

export default Detail;
