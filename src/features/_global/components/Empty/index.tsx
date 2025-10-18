import clsx from "clsx";
import {
  FileSearch,
  Ghost,
  Loader2,
  PackageOpen,
  ServerOff,
  Table2,
  Telescope
} from "lucide-react";
import { Poppins } from "../Text";

interface IEmptyProps {
  description?: string | string[];
  colspan?: number;
  customMinHeight?: number | string;
  variant?: 
    | "default" 
    | "table" 
    | "loading"
    | "search"
    | "error"
    | "discovery"
    | "archive";
  iconSize?: number;
  className?: string;
}

export const EmptyState: React.FC<IEmptyProps> = ({
  description,
  colspan,
  customMinHeight = "300px",
  variant = "default",
  iconSize = 48,
  className,
}) => {
  const descriptions = Array.isArray(description) 
    ? description 
    : description ? [description] : [];

  const iconMap = {
    default: <Ghost size={iconSize} className="opacity-80" />,
    table: <Table2 size={iconSize} className="opacity-80" />,
    loading: <Loader2 size={iconSize} className="animate-spin" />,
    search: <FileSearch size={iconSize} className="opacity-80" />,
    error: <ServerOff size={iconSize} className="text-rose-500" />,
    discovery: <Telescope size={iconSize} className="text-indigo-500" />,
    archive: <PackageOpen size={iconSize} className="text-amber-500" />,
  };

  const wrapperClass = clsx(
    "flex flex-col items-center justify-center w-full p-6 gap-4",
    "text-gray-600 dark:text-gray-300",
    className
  );

  const content = (
    <div className={wrapperClass} style={{ minHeight: customMinHeight }}>
      <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
        {iconMap[variant]}
      </div>
      
      {descriptions.length > 0 && (
        <div className="flex flex-col items-center gap-2 text-center max-w-md">
          {descriptions.map((item, index) => (
            <Poppins 
              key={index} 
              className={clsx(
                "text-base font-medium",
                variant === "error" ? "text-rose-600 dark:text-rose-400" : ""
              )}
            >
              {item}
            </Poppins>
          ))}
        </div>
      )}
    </div>
  );

  return colspan ? (
    <td colSpan={colspan} className="!p-0 bg-gray-50 dark:bg-gray-900/50">
      {content}
    </td>
  ) : (
    content
  );
};