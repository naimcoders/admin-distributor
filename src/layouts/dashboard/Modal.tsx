import cx from "classnames";
import transferImg from "src/assets/images/transfer.png";
import topUpImg from "src/assets/images/top up.png";
import pilipayLogo from "src/assets/images/pilipay.png";
import Image from "src/components/Image";
import { Modal } from "src/components/Modal";
import { useActiveModal } from "src/stores/modalStore";

const CustomeHeader = () => {
  return (
    <header>
      <img
        src={pilipayLogo}
        alt="Pilipay"
        className="w-[10rem]"
        loading="lazy"
      />
    </header>
  );
};

export const HistoryModal = () => {
  const { isHistory, actionIsHistory } = useActiveModal();

  return (
    <Modal
      isOpen={isHistory}
      closeModal={actionIsHistory}
      customHeader={<CustomeHeader />}
    >
      <main className="my-6 text-sm">
        <section className="flexcol gap-4 py-4 border-t border-gray-300">
          <h2 className="font-interMedium">Jumat, 22 Des 2023</h2>
          <History
            label="Top Up"
            desc="Alfamart"
            icon={{ src: topUpImg, alt: "Top Up Image" }}
            total={(100000).toLocaleString("id-ID")}
          />
          <History
            label="Transfer"
            desc="08221134567"
            icon={{ src: transferImg, alt: "Transfer Image" }}
            total={(75000).toLocaleString("id-ID")}
          />
        </section>
        <section className="flexcol gap-4 py-4 border-t border-gray-300">
          <h2 className="font-interMedium">Kamis, 21 Des 2023</h2>
          <History
            label="Transfer"
            desc="Mandiri"
            icon={{ src: transferImg, alt: "Transfer Image" }}
            total={(50000).toLocaleString("id-ID")}
          />
        </section>
      </main>
    </Modal>
  );
};

const History: React.FC<{
  icon: { src: string; alt: string };
  label: string;
  desc: string;
  total: string;
}> = (props) => {
  return (
    <section className="flex justify-between">
      <section className="flex items-center gap-3">
        <Image
          src={props.icon.src}
          alt={props.icon.alt}
          width={25}
          radius="none"
        />
        <section>
          <h2 className="font-interMedium">{props.label}</h2>
          <p className="text-xs">{props.desc}</p>
        </section>
      </section>

      <h2
        className={cx(
          "font-interMedium",
          props.label === "Top Up" && "text-[#2754bb]"
        )}
      >
        {props.label === "Top Up" ? "+" : "-"}Rp {props.total}
      </h2>
    </section>
  );
};
