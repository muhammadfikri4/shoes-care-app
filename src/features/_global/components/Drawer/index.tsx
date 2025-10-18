import React, { CSSProperties, PropsWithChildren, ReactNode } from "react";
import { createPortal } from "react-dom";
import { BiChevronLeft } from "react-icons/bi";
import { Poppins } from "../Text";
import { ConditionNode } from "../ConditionNode";

interface DrawerProps extends PropsWithChildren {
  show: boolean;
  onHide: VoidFunction;
  close?: {
    icon?: ReactNode;
    onClick?: VoidFunction;
    title?: string;
  };
  style?: CSSProperties;
  position?: "right" | "left";
  withIcon?: boolean;
}

export const Drawer: React.FC<DrawerProps> = ({
  onHide,
  show,
  children,
  close,
  style,
  position = "right",
  withIcon = true,
}) => {
  return (
    <>
      {createPortal(
        <div
          className={`fixed ${
            position === "left" ? "left-0 justify-start" : "right-0 justify-end"
          } top-0 bottom-0 bg-[rgba(0, 0, 0, 0.61)] backdrop:filter backdrop-blur-sm z-40 flex items-center w-screen cursor-pointer duration-300 ${
            show ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
          onClick={onHide}
        >
          <div
            className={`bg-white h-[90vh] lg:w-96 w-[85%] rounded-xl transition-transform duration-300 transform shadow-[0_0_10px_rgba(0,0,0,0.1)] cursor-default ${
              show
                ? "translate-x-0"
                : position === "left"
                ? "-translate-x-full"
                : "translate-x-full"
            } overflow-auto`}
            onClick={(e) => e.stopPropagation()}
            style={style}
          >
            <div
              className="flex items-center cursor-pointer"
              onClick={() => (close?.onClick ? close.onClick() : onHide())}
            >
              <div className="ml-2 my-4 p-2 w-max h-max">
                {close?.icon && withIcon ? (
                  close?.icon
                ) : withIcon ? (
                  <BiChevronLeft size={24} />
                ) : (
                  false
                )}
              </div>
              <ConditionNode condition={!!close?.title}>
                <Poppins className="text-sm">{close?.title || "Back"}</Poppins>
              </ConditionNode>
            </div>
            {children}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
