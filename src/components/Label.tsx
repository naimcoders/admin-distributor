import cx from "classnames";
import React, { HTMLAttributes } from "react";
import { Product } from "src/api/product.service";
import { Currency } from "src/helpers";

interface LabelProps extends Pick<HTMLAttributes<HTMLDivElement>, "className"> {
  label: string | number;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

const Label: React.FC<LabelProps> = (props) => {
  return (
    <p className={cx("flex gap-2", props.className)}>
      {props.endContent}
      {props.label}
      {props.startContent}
    </p>
  );
};

export const LabelPrice: React.FC<LabelProps & { product: Product }> = ({
  className,
  product,
}) => {
  const [price, setPrice] = React.useState("");

  React.useEffect(() => {
    const variantColor = product.variantProduct.map(
      (e) => e.variantColorProduct
    );
    const prices: number[] = [];
    variantColor.forEach((e) => {
      e.forEach((m) => {
        prices.push(m.price ?? 0);
      });
    });

    if (prices.length < 1) {
      setPrice(Currency(product.price.price));
    } else {
      const min = Currency(Math.min(...prices));
      const max = Currency(Math.max(...prices));
      setPrice(min === max ? max : `${min} - ${max}`);
    }
  }, [product]);

  return <p className={cx("truncate", className)}>{price}</p>;
};

export default Label;
