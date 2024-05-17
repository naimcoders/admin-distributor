import mokes from "src/assets/images/mokes.png";
import { Button } from "src/components/Button";
import { useNavigate } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import Image from "src/components/Image";

const NotFound = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <main className="bg-primary h-screen px-4 py-8 flex flex-col sm:flex-row gap-16 sm:flex-wrap justify-center">
      <section className="flex flex-col gap-8 text-center sm:justify-center sm:items-center sm:flex-1">
        <section className="flex flex-col gap-2">
          <h1 className="font-interBold text-white text-4xl lg:text-6xl">
            404
          </h1>
          <h1 className="capitalize font-interMedium text-white text-2xl">
            halaman tidak ditemukan!
          </h1>
        </section>
        <Button
          label="Kembali"
          onClick={goBack}
          color="secondary"
          className="text-black font-interMedium"
          startContent={<HiOutlineArrowLeft size={18} />}
        />
      </section>
      <section className="flex justify-center sm:items-center sm:flex-1">
        <Image src={mokes} alt="Mokes" width={250} loading="lazy" />
      </section>
    </main>
  );
};

export default NotFound;
