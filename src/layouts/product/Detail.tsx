import { useParams } from "react-router-dom";
import { useProduct } from "src/api/product.service";
import Error from "src/components/Error";
import Skeleton from "src/components/Skeleton";

const Detail = () => {
  const { id } = useParams() as { id: string };
  const { isLoading, error, data } = useProduct().findById(id);

  console.log(data);

  return (
    <>
      {error ? (
        <Error error={error} />
      ) : isLoading ? (
        <Skeleton />
      ) : (
        <main>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nihil
            cupiditate dicta culpa doloremque libero magnam ullam soluta
            consequuntur voluptatem asperiores possimus, obcaecati, aperiam in
            eum voluptatibus id mollitia architecto explicabo sequi molestias.
            Omnis, atque temporibus nihil cum perspiciatis error labore eaque
            aspernatur adipisci aliquam illo, alias itaque dolorem ut
            voluptatem!
          </p>
        </main>
      )}
    </>
  );
};

export default Detail;
