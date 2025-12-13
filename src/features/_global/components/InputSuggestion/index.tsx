import { useMemo, useRef, useState } from "react";
import { Input } from "../Input";

export type Option<T = string> = {
  label: string;
  value: T;
  disabled?: boolean;
};

interface InputSuggestionProps<T = string> {
  list: Option<T>[];
  value?: string;
  onClickContainer?: VoidFunction;
  placeholder?: string;
  disabled?: boolean;
  maxSuggestions?: number;
  onChangeText: (text: string) => void;
  onSelect: (option: Option<T>) => void;
  emptyValueOnAdd?: boolean;
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ label, query }: { label: string; query: string }) {
  if (!query) return <span className="text-gray-500 text-sm">{label}</span>;
  const parts = label.split(new RegExp(`(${escapeRegExp(query)})`, "ig"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="font-medium text-sm">
            {part}
          </span>
        ) : (
          <span key={i} className="text-gray-500 text-sm">
            {part}
          </span>
        )
      )}
    </>
  );
}

export const InputSuggestion = <T,>({
  list,
  value,
  placeholder,
  disabled,
  maxSuggestions = 8,
  onClickContainer,
  onChangeText,
  onSelect,
  emptyValueOnAdd = true,
}: InputSuggestionProps<T>) => {
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const stringValue = value || "";

  const filtered = useMemo(() => {
    const q = stringValue.trim();
    if (!q) return list.slice(0, maxSuggestions);
    const f = list.filter((o) =>
      o.label.toLowerCase().includes(q.toLowerCase())
    );
    return f.slice(0, maxSuggestions);
  }, [list, stringValue, maxSuggestions]);

  const hasMatch = useMemo(() => {
    const q = stringValue.trim();
    if (!q) return true;
    return list.some((o) => o.label.toLowerCase() === q.toLowerCase());
  }, [list, stringValue]);

  const handleSelect = (opt: Option<T>) => {
    onSelect(opt);
    setOpen(false);
    setHighlightIndex(-1);
  };

  const handleAddNew = () => {
    const label = stringValue;
    const opt: Option<T> = {
      label,
      value: emptyValueOnAdd ? ("" as T) : (label as unknown as T),
    };
    onSelect(opt);
    setOpen(false);
  };

  /** Auto-scroll ke item yang di-highlight */
  const scrollToItem = (index: number) => {
    if (!listRef.current) return;
    const item = listRef.current.children[index] as HTMLElement;
    if (item) {
      item.scrollIntoView({ block: "nearest" });
    }
  };

  /** Keyboard navigation */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (highlightIndex + 1) % filtered.length;
      setHighlightIndex(nextIndex);
      scrollToItem(nextIndex);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex =
        highlightIndex <= 0 ? filtered.length - 1 : highlightIndex - 1;
      setHighlightIndex(prevIndex);
      scrollToItem(prevIndex);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0) {
        handleSelect(filtered[highlightIndex]);
      } else if (!hasMatch && stringValue.trim()) {
        handleAddNew();
      }
    }
  };

  return (
    <div onClick={onClickContainer} ref={wrapRef} className="relative">
      <form onSubmit={(e) => (e.preventDefault(), handleAddNew())}>
        <Input
          placeholder={placeholder}
          value={stringValue}
          disabled={disabled}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            onChangeText(e.target.value);
            setOpen(true);
            setHighlightIndex(-1);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
        />
      </form>

      {open && (filtered.length || stringValue) ? (
        <div className="absolute z-[1000] mt-1 w-full top-full rounded-md border bg-white shadow-lg">
          <ul ref={listRef} className="max-h-64 px-3 w-full overflow-auto py-1 list-none">
            {filtered.map((opt, idx) => (
              <li
                key={String(opt.label)}
                className={`cursor-pointer px-3 py-2 rounded-md hover:bg-gray-100 flex items-center ${
                  highlightIndex === idx ? "bg-gray-200" : ""
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (opt.disabled) return;
                  handleSelect(opt);
                }}
              >
                <Highlight label={opt.label} query={stringValue} />
              </li>
            ))}

            {stringValue.trim() && !hasMatch && (
              <li
                className={`cursor-pointer hover:bg-gray-50 flex items-center px-3 py-2 ${
                  filtered.length ? "border-t border-gray-200" : ""
                }`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleAddNew}
              >
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500 font-bold">+</span>
                  <span className="text-sm">
                    Tambah "
                    <span className="font-medium text-gray-900">
                      {stringValue}
                    </span>
                    "
                  </span>
                </div>
              </li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
