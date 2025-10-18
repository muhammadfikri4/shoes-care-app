import React, { ReactNode } from "react";
import { createPortal } from "react-dom";
import { Poppins } from "../Text";

interface DialogProps {
  show: boolean;
  onHide: () => void;
  children?: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ onHide, show, children }) => {
  return (
    <>
      {show && (
        <>
          {createPortal(
            <div
              className="fixed inset-0 p-4 z-[1000] overflow-auto grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
              onClick={onHide}
            >
              <div
                data-dialog="dialog"
                className="relative w-full sm:min-w-[200px] z-[99999999] sm:max-w-[40%] min-h-10 overflow-auto rounded-lg bg-white t ext-base font-light leading-relaxed text-blue-gray-500 antialiased shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Poppins>{children}</Poppins>
              </div>
            </div>,
            document.body
          )}
        </>
      )}
    </>
  );
};
