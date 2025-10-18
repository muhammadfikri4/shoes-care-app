import clsx from "clsx";
import React, { PropsWithChildren } from "react";

interface ITableBodyProps extends PropsWithChildren {
  children: React.ReactNode;
  className?: string
}

export const Table: React.FC<ITableBodyProps> = ({ children, className }) => {
  return (
    <>
      <div className={clsx('overflow-x-auto rounded-md border border-solid border-gray-300', className)}>
        <table className="w-full">{children}</table>
      </div>
    </>
  );
};
