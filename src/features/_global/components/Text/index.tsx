import clsx from "clsx";
import { ReactNode } from "react";

interface IPoppinsProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export const Poppins: React.FC<IPoppinsProps> = ({ children, ...rest }) => {
  return (
    <p id="poppins" {...rest} className={clsx("font-[Poppins]", rest.className)}>
      {children}
    </p>
  );
};
