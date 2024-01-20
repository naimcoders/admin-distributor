import { Skeleton as Load } from "@nextui-org/react";

const Skeleton = () => {
  return (
    <>
      {[1, 2, 3].map((num) => (
        <Load className="rounded-lg" key={num}>
          <div className="h-20 rounded-lg bg-default-300"></div>
        </Load>
      ))}
    </>
  );
};

export default Skeleton;
