import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { MdKeyboardArrowDown, MdOutlineSearch } from "react-icons/md";
import { Input } from "../Input";

export interface ListItem {
  label: string;
  value: string;
  disabled?: boolean;
}
export interface IDropdownProps {
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

const initValue: ListItem = { label: "", value: "", disabled: false };

type MenuPos = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
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

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [pos, setPos] = useState<MenuPos | null>(null);

  useEffect(() => setData(list), [list]);
  useEffect(() => {
    if (reset) setSelected(initValue);
  }, [reset]);

  // Tutup jika klik di luar (root + menu portal)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hitung posisi menu setiap open/resize/scroll
  useLayoutEffect(() => {
    if (!show || !triggerRef.current) return;

    const compute = () => {
      const rect = triggerRef.current!.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const viewportW = window.innerWidth;

      const spaceBelow = viewportH - rect.bottom;

      const gap = 8; // jarak antara trigger dan menu
      const minHeight = 120; // tinggi minimal menu

      // Selalu buka ke bawah
      const maxHeight = Math.max(minHeight, spaceBelow - 16);
      const top = rect.bottom + gap;

      const left = Math.min(rect.left, viewportW - rect.width - 8);

      setPos({
        top: Math.round(top),
        left: Math.round(left),
        width: Math.round(rect.width),
        maxHeight: Math.round(maxHeight),
      });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(document.documentElement);

    const onScroll = () => compute();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", compute);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", compute);
    };
  }, [show]);

  // Filter lokal saat search
  const onLocalSearch = useCallback(
    (q: string) => {
      onSearch?.(q);
      if (!q) {
        setData(list);
        return;
      }
      setData((prev) =>
        (prev.length ? prev : list).filter((item) =>
          item.label.toLowerCase().includes(q.toLowerCase())
        )
      );
    },
    [list, onSearch]
  );

  const menu = useMemo(() => {
    if (!show || !pos) return null;
    return createPortal(
      <div
        ref={menuRef}
        style={{
          position: "fixed",
          top: pos.top,
          left: pos.left,
          width: pos.width,
          maxHeight: pos.maxHeight,
          zIndex: 2147483647, // paling atas
          boxShadow: withShadow ? "0px 8px 12px 0px rgba(0,0,0,0.08)" : "none",
        }}
        className="overflow-auto flex flex-col gap-1 bg-white border border-solid border-gray-300 rounded-lg px-2 py-2"
      >
        {searchInput && (
          <div className="sticky top-0 bg-white z-10 py-2">
            <Input
              value={inputValue}
              inputSize="md"
              placeholder="Search"
              LeftIcon={<MdOutlineSearch className="text-xl text-gray-500" />}
              onChange={(e) => onLocalSearch(e.target.value)}
            />
          </div>
        )}

        {(data?.length
          ? data
          : [{ label: "Not Found", value: "Not Found", disabled: true }]
        ).map((item) => (
          <div
            key={item.value}
            onClick={() => {
              if (item.disabled) return;
              setShow(false);
              setSelected(item);
              onChange?.(item);
            }}
            className={`w-full rounded-lg flex items-center px-4 py-3 ${
              !item.disabled
                ? "hover:bg-gray-100 cursor-pointer"
                : "text-gray-500"
            }`}
          >
            <p className="text-sm font-poppins">{item.label}</p>
          </div>
        ))}
      </div>,
      document.body
    );
  }, [
    show,
    pos,
    withShadow,
    searchInput,
    inputValue,
    data,
    onLocalSearch,
    onChange,
  ]);

  return (
    <div
      ref={rootRef}
      className={`relative w-full ${
        disabled ? "bg-gray-200" : "bg-white"
      } rounded-lg`}
    >
      <div
        ref={triggerRef}
        tabIndex={0}
        onClick={() => !disabled && setShow((prev) => !prev)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`relative border border-solid border-gray-300 w-full rounded-lg flex items-center justify-between px-4 py-2 ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        } ${isFocused ? "ring-2 ring-blue-200" : ""}`}
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

      {/* Menu dipindah ke portal agar selalu di atas */}
      {menu}
    </div>
  );
};
