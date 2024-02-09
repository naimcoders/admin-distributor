import { Skeleton as Load } from "@nextui-org/react";

const Skeleton = () => {
  return (
    <section className="flexcol gap-5">
      {[1, 2, 3].map((num) => (
        <Load className="rounded-lg" key={num}>
          <div className="h-20 rounded-lg bg-default-300"></div>
        </Load>
      ))}
    </section>
  );
};

export default Skeleton;
