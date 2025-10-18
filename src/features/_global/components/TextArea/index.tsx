import React from "react";
import { TextAreaProps } from "./types";

export const TextArea: React.FC<TextAreaProps> = ({
  variant = "normal",
  ...rest
}) => {
  return (
    <>
      <textarea
        className={`rounded-md px-4 py-2 border focus:outline-none duration-300 w-full ${
          variant === "normal"
            ? "focus:border-blue-500 border-[#DADADA]"
            : "focus:border-red-500 border-red-500"
        }
        `}
        {...rest}
      ></textarea>
    </>
  );
};
