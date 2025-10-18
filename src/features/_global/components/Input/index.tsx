import React, { forwardRef, ReactNode, useState } from "react";

type NumberString = string | number;

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  rounded?: "sm" | "md" | "lg" | "full";
  error?: boolean;
  LeftIcon?: ReactNode;
  onClickLeftIcon?: () => void;
  onClickRightIcon?: () => void;
  RightIcon?: ReactNode;
  inputSize?: "sm" | "md" | "lg";
  borderColor?: "black" | "normal";
  placeholderColor?: "black" | "normal";
  errorText?: string;
  inputStyle?: "addons" | "icon";
  currency?: boolean;
  onValueChange?: (value: string) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    rounded = "md",
    LeftIcon,
    RightIcon,
    onClickLeftIcon,
    onClickRightIcon,
    error = false,
    errorText,
    inputSize = "md",
    borderColor = "normal",
    placeholderColor = "normal",
    inputStyle = "icon",
    currency = false,
    ...rest
  }) => {
    const [formatedValue, setFormatedValue] = useState<NumberString>(
      (rest.value as NumberString) || ""
    );
    return (
      <div className="flex flex-col">
        <div
          className={`flex items-center justify-between relative w-full overflow-hidden ${
            rounded == "full"
              ? "rounded-full"
              : rounded == "sm"
              ? "rounded-sm"
              : rounded == "md"
              ? "rounded-md"
              : "rounded-lg"
          }`}
        >
          {LeftIcon && inputStyle === "icon" && (
            <div className="absolute py-4 px-2" onClick={onClickLeftIcon}>
              {LeftIcon}
            </div>
          )}
          {LeftIcon && inputStyle === "addons" && (
            <div className="absolute h-full w-[2rem]" onClick={onClickLeftIcon}>
              {LeftIcon}
            </div>
          )}
          <input
            {...rest}
            value={
              currency
                ? typeof formatedValue === "number"
                  ? new Intl.NumberFormat("id-ID").format(formatedValue)
                  : formatedValue
                : rest.value
            }
            onChange={(e) => {
              if (currency) {
                const numericValue = Number(e.target.value.replace(/\D/g, "")); // Menghapus semua karakter non-digit
                const formatted = new Intl.NumberFormat("id-ID").format(
                  numericValue
                );
                e.target.value = numericValue.toString();
                setFormatedValue(formatted);
              }
              rest.onChange?.(e);
            }}
            className={`
          border
          ${inputStyle === "addons" && LeftIcon ? "pl-[3.5rem]" : ""}
          ${inputStyle === "addons" && RightIcon ? "pr-[3.5rem]" : ""}
          ${
            inputSize === "sm"
              ? "px-2"
              : inputSize === "md"
              ? "px-4"
              : inputSize === "lg"
              ? "px-6"
              : ""
          }
              ${
                inputSize === "sm"
                  ? "h-8"
                  : inputSize === "md"
                  ? "h-10"
                  : "h-12"
              }
          ${inputSize === "sm" ? "py-2" : inputSize === "md" ? "py-3" : "py-4"}
          ${LeftIcon ? "pl-10" : ""}
          ${RightIcon ? "pr-10" : ""}
          ${
            error
              ? "border-red-500"
              : borderColor === "black"
              ? "border-black"
              : "border-[#DADADA]"
          }
          focus:border
          placeholder:text-sm
          placeholder:font-[Poppins]
          ${
            placeholderColor === "black"
              ? "placeholder:text-black"
              : "placeholder:text-[#87898E]"
          }
          ${error ? "focus:border-red-500" : "focus:border-blue-500"}
          duration-300
          font-poppins
          text-sm
          focus:outline-none
          w-full
          ${error ? "text-red-500" : ""}
          ${rest.disabled ? "text-gray-500" : ""}
          ${
            rounded == "full"
              ? "rounded-full"
              : rounded == "sm"
              ? "rounded-sm"
              : rounded == "md"
              ? "rounded-md"
              : "rounded-lg"
          }
          `}
          />
          {RightIcon && inputStyle === "icon" && (
            <div className="absolute right-0 p-4" onClick={onClickRightIcon}>
              <div>{RightIcon}</div>
            </div>
          )}
          {RightIcon && inputStyle === "addons" && (
            <div
              className="absolute right-0 h-full w-[2rem]"
              onClick={onClickRightIcon}
            >
              {RightIcon}
            </div>
          )}
        </div>
        {error && errorText && (
          <small className="ms-2 mt-1 text-red-500">{errorText}</small>
        )}
      </div>
    );
  }
);
