import { IButtonProps } from ".";

export const generateSize = (size: IButtonProps["size"]) => {
  switch (size) {
    case "lg":
      return "px-4 py-2 text-sm";
    case "md":
      return "px-3 py-1.5 text-sm";
    case "sm":
      return "px-2 py-1 text-xs";
    default:
      return "px-3 py-1.5 text-sm";
  }
};