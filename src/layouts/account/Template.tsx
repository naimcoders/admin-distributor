import { Button } from "src/components/Button";

interface TemplateProps {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
  btnLabelForm?: string;
}

const Template: React.FC<TemplateProps> = ({
  children,
  onClick,
  title,
  btnLabelForm,
}) => {
  return (
    <main className="p-5 bg-white rounded-lg max-w-[24rem] flexcol gap-6 mt-5">
      <h1 className="font-interBold text-xl">{title}</h1>

      <section className="flexcol gap-7">{children}</section>

      <div className="flex justify-center">
        <Button aria-label={btnLabelForm} onClick={onClick} />
      </div>
    </main>
  );
};

export default Template;
