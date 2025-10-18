import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown, MdOutlineSearch } from "react-icons/md";
import { Input } from "../Input";

export interface ListItem {
  label: string;
  value: string;
  disabled?: boolean;
}

interface IDropdownProps {
  list: ListItem[];
  placeholder?: string;
  defaultValue?: ListItem;
  searchInput?: boolean;
  onSearch?: (e: string) => void;
  onChange?: (e: ListItem) => void;
  disabled?: boolean;
  inputValue?: string;
  reset?: boolean;
  withShadow?: boolean;
}

const initValue: ListItem = {
  label: "",
  value: "",
  disabled: false,
};

export const DropdownRevamp: React.FC<IDropdownProps> = ({
  list,
  placeholder,
  defaultValue,
  onChange,
  searchInput = false,
  onSearch,
  disabled,
  inputValue,
  reset,
  withShadow,
}) => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(list || []);
  const [isFocused, setIsFocused] = useState(false);
  const [selected, setSelected] = useState(reset ? initValue : defaultValue);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setData(list);
  }, [list]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShow(false); // Tutup popup jika klik di luar
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (reset) setSelected(initValue);
  }, [reset]);

  return (
    <div
      ref={ref}
      className={`relative w-full ${
        disabled ? "bg-gray-200" : "bg-white"
      } rounded-lg z-[${isFocused ? "50" : "20"}]`}
    >
      <div
        onClick={() => !disabled && setShow((prev) => !prev)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`relative border border-solid border-gray-300 z-${
          isFocused ? "50" : "10"
        } w-full rounded-lg flex items-center justify-between px-4 py-2 ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <p
          className={`text-sm font-poppins ${
            disabled ? "text-gray-500" : ""
          } font-medium duration-200 ${
            !selected?.label && placeholder ? "opacity-50" : ""
          }`}
        >
          {defaultValue?.label || selected?.label || placeholder || ""}
        </p>
        <MdKeyboardArrowDown
          className={`text-2xl text-gray-500 duration-300 ${
            show ? "rotate-180" : ""
          }`}
        />
      </div>
      {show && (
        <div className="relative z-20">
          <div
            className="absolute z-20 overflow-auto max-h-96 flex flex-col gap-1 w-full right-0 bg-white border border-solid border-gray-300 rounded-lg mt-2 px-2 py-2"
            style={{
              boxShadow: withShadow
                ? "0px 8px 12px 0px rgba(0, 0, 0, 0.08)"
                : "none",
            }}
          >
            {searchInput && (
              <div className="sticky top-0 bg-white z-20 py-2">
                <Input
                  value={inputValue}
                  inputSize="md"
                  placeholder="Search"
                  LeftIcon={
                    <MdOutlineSearch className="text-xl text-gray-500" />
                  }
                  onChange={(e) => {
                    onSearch?.(e.target.value);
                    if (!e.target.value) {
                      setData(list);
                      return;
                    }
                    setData((prev) =>
                      prev.filter((item) =>
                        item.label
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase())
                      )
                    );
                  }}
                />
              </div>
            )}
            {(data?.length
              ? data
              : [{ label: "Not Found", value: "Not Found", disabled: true }]
            )?.map((item) => (
              <div
                onClick={() => {
                  if (item.disabled) return;
                  setShow((prev) => !prev);
                  setSelected(item);
                  onChange?.(item);
                }}
                className={`w-full rounded-lg flex items-center px-4 py-3 ${
                  !item.disabled ? "hover:bg-gray-100 cursor-pointer" : ""
                }`}
              >
                <p
                  className={`text-sm font-poppins ${
                    item.disabled ? "text-gray-500" : ""
                  }`}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
