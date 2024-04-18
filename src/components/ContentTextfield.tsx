import { FC, ReactNode } from "react";
import { IconColor } from "src/types";

interface ContentProps {
  label?: string;
  children?: ReactNode;
}

const ContentTextfield: FC<ContentProps> = ({ label, children }) => {
  return (
    <>
      {label ? (
        <div className={`text-[${IconColor.zinc}] text-sm cursor-default`}>
          {label}
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default ContentTextfield;
