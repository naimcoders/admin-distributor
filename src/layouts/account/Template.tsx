import cx from "classnames";
import { Button } from "src/components/Button";

interface TemplateProps {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  btnLabelForm?: string | React.ReactNode;
}

const Template: React.FC<TemplateProps> = ({
  children,
  onClick,
  title,
  btnLabelForm,
  className,
}) => {
  return (
    <main
      className={cx(
        "p-5 bg-white rounded-lg max-w-[24rem] flex flex-col gap-6 mt-5",
        className
      )}
    >
      <h1 className="font-bold text-xl">{title}</h1>
      <section className="flex flex-col gap-7">{children}</section>

      <Button label={btnLabelForm} onClick={onClick} className="mx-auto" />
    </main>
  );
};

export default Template;
