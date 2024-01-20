import singleLogo from "src/assets/images/icon_pilipilih flat_white.png";
import { Button } from "src/components/Button";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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
          aria-label="Kembali"
          onClick={goBack}
          color="secondary"
          className="text-black font-interMedium"
          startContent={<ArrowLeftIcon width={18} />}
        />
      </section>
      <section className="flex justify-center sm:items-center sm:flex-1">
        <img src={singleLogo} alt="Single Logo" className="w-72 opacity-50" />
      </section>
    </main>
  );
};

export default NotFound;
