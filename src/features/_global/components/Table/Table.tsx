import clsx from "clsx";
import React, { PropsWithChildren } from "react";

interface ITableBodyProps extends PropsWithChildren {
  children: React.ReactNode;
  className?: string;
  rounded?: {
    "top-left"?: boolean;
    "top-right"?: boolean;
    "bottom-left"?: boolean;
    "bottom-right"?: boolean;
  };
  border?: {
    top?: boolean;
    right?: boolean;
    bottom?: boolean;
    left?: boolean;
  };
}

export const Table: React.FC<ITableBodyProps> = ({
  children,
  className,
  rounded = {
    "bottom-left": true,
    "bottom-right": true,
    "top-left": true,
    "top-right": true,
  },
  border = {
    bottom: true,
    left: true,
    right: true,
    top: true,
  },
}) => {
  return (
    <>
      <div
        className={clsx(
          "overflow-x-auto border border-solid border-gray-300",
          className
        )}
        style={{
          // radius
          borderTopLeftRadius: rounded?.["top-left"] ? 6 : 0,
          borderTopRightRadius: rounded?.["top-right"] ? 6 : 0,
          borderBottomLeftRadius: rounded?.["bottom-left"] ? 6 : 0,
          borderBottomRightRadius: rounded?.["bottom-right"] ? 6 : 0,

          // border width
          borderTopWidth: border?.top ? 0 : 1,
          borderBottomWidth: border?.bottom ? 0 : 1,
          borderLeftWidth: border?.left ? 0 : 1,
          borderRightWidth: border?.right ? 0 : 1,
        }}
      >
        <table className="w-full">{children}</table>
      </div>
    </>
  );
};
