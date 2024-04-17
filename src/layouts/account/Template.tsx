import { Button } from "src/components/Button";

interface TemplateProps {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
  btnLabelForm?: string | React.ReactNode;
}

const Template: React.FC<TemplateProps> = ({
  children,
  onClick,
  title,
  btnLabelForm,
}) => {
  return (
    <main className="p-5 bg-white rounded-lg max-w-[24rem] flex flex-col gap-6 mt-5">
      <h1 className="font-bold text-xl">{title}</h1>

      <section className="flex flex-col gap-7">{children}</section>

      <div className="flex justify-center">
        <Button label={btnLabelForm} onClick={onClick} />
      </div>
    </main>
  );
};

export default Template;
