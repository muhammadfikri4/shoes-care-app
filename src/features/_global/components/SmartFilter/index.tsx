import React, {
  HTMLAttributes,
  memo,
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { FiSearch } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import { formatDateToMMDDYYYY } from "../../utils/format";
import { Button } from "../Button";
import { DatePicker, DateProps } from "../Date";
import { DropdownRevamp, IDropdownProps } from "../Dropdown/DropdownRevamp";
import { Input, InputProps } from "../Input";

/** ====== Types ====== */
export type BaseValue = { label: string; value: string };

export interface FilterKey {
  filter: Record<string, BaseValue>;
}

interface FilterButtonProps {
  /** key untuk disimpan di JSON filter */
  key: string;
  /** pakai select (dropdown) */
  dropdownProps?: IDropdownProps;
  /** pakai input date / date range */
  dateProps?: DateProps;

  inputProps?: InputProps;
  /** lebar kolom (Tailwind) */
  widthClass?: HTMLAttributes<HTMLDivElement>["className"];
}

interface CustomSectionProps extends PropsWithChildren {
  inputProps?:
    | (React.InputHTMLAttributes<HTMLInputElement> & {
        leftIcon?: React.ReactNode;
      })
    | null;
  filterButton?: FilterButtonProps[];
  action?: Array<
    React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }
  >;
  className?: string;
}

const Section: React.FC<CustomSectionProps> = memo(
  ({ children, filterButton, inputProps, action, className }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Ambil filter JSON dari query
    const currentFilter: FilterKey["filter"] = useMemo(() => {
      const raw = searchParams.get("filter");
      if (!raw) return {};
      try {
        return JSON.parse(raw) as FilterKey["filter"];
      } catch {
        return {};
      }
    }, [searchParams]);

    // --- Input Search (debounced) ---
    const [searchValue, setSearchValue] = useState(
      currentFilter?.search?.value ?? ""
    );
    const debounceTimer = useRef<number | null>(null);

    const commitFilter = useCallback(
      (next: FilterKey["filter"]) => {
        const nextParams = new URLSearchParams(searchParams.toString());
        if (Object.keys(next).length === 0) {
          nextParams.delete("filter");
        } else {
          nextParams.set("filter", JSON.stringify(next));
        }
        setSearchParams(nextParams, { replace: true });
      },
      [searchParams, setSearchParams]
    );

    const handleSearchChange = useCallback(
      (value: string) => {
        setSearchValue(value);
        if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
        debounceTimer.current = window.setTimeout(() => {
          const curr = { ...currentFilter };
          if (!value) {
            const { search, ...rest } = curr;
            void search;
            commitFilter(rest);
          } else {
            curr.search = { label: value, value };
            commitFilter(curr);
          }
        }, 400);
      },
      [commitFilter, currentFilter]
    );

    const setKey = useCallback(
      (key: string, label: string, value: string) => {
        const next = { ...currentFilter, [key]: { label, value } };
        commitFilter(next);
      },
      [commitFilter, currentFilter]
    );

    const reset = useCallback(() => {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete("filter");
      setSearchParams(nextParams, { replace: true });
      setSearchValue("");
    }, [searchParams, setSearchParams]);

    const isReset = Object.keys(currentFilter).length > 0;

    return (
      <div
        className={[
          "border border-gray-200 rounded-md",
          className || "",
          "w-full",
        ].join(" ")}
      >
        {filterButton?.length || inputProps || action?.length ? (
          <div
            className={
              // ⬇ responsive layout: stack di mobile, horizontal di md+
              "px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            }
          >
            {/* LEFT: Search input */}
            <div
              className={
                // ⬇ full width di mobile
                "flex items-center gap-3 flex-wrap w-full md:w-auto"
              }
            >
              {inputProps ? (
                <div className="relative w-full md:w-72">
                  <Input
                    {...inputProps}
                    className={["w-full", inputProps.className || ""].join(" ")}
                    value={searchValue}
                    LeftIcon={<FiSearch />}
                    onChange={(e) => {
                      handleSearchChange(e.target.value);
                      inputProps?.onChange?.(e);
                    }}
                    placeholder={inputProps.placeholder || "Cari..."}
                  />
                </div>
              ) : null}
            </div>

            {/* RIGHT: Filters + Reset + Actions */}
            <div
              className={
                // ⬇ di mobile: semua item full width & bertumpuk
                "flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-wrap w-full md:w-auto"
              }
            >
              {filterButton?.map((item) => {
                const selected = currentFilter[item.key] ?? {
                  label: "",
                  value: "",
                };

                // Wrapper agar full width di mobile; bisa override via widthClass
                const wrapperClass =
                  item.widthClass ??
                  // default: full di mobile, ukuran tetap di md+
                  "w-full md:w-56";

                // Dropdown
                if (item.dropdownProps) {
                  const { list, ...rest } = item.dropdownProps;
                  return (
                    <div key={item.key} className={wrapperClass}>
                      <DropdownRevamp
                        {...rest}
                        // pastikan komponen isi melebar
                        list={list}
                        defaultValue={
                          selected.value ? selected : rest.defaultValue
                        }
                        onChange={(opt) => {
                          item.dropdownProps?.onChange?.(opt);
                          const found = list.find(
                            (o) => String(o.value) === opt.value
                          );
                          if (found)
                            setKey(item.key, found.label, String(found.value));
                          else setKey(item.key, "", "");
                        }}
                      />
                    </div>
                  );
                }

                // Plain input filter
                if (item.inputProps) {
                  return (
                    <div key={item.key} className={wrapperClass}>
                      <Input
                        {...item.inputProps}
                        className={[
                          "w-full",
                          item.inputProps.className || "",
                        ].join(" ")}
                        value={selected.value}
                        LeftIcon={item.inputProps.LeftIcon ?? <FiSearch />}
                        onChange={(e) => {
                          const v = e.target.value;
                          setKey(item.key, v, v);
                          item.inputProps?.onChange?.(e);
                        }}
                        placeholder={item.inputProps.placeholder || "Cari..."}
                      />
                    </div>
                  );
                }

                // Date / Date Range
                const safeDate = selected.value
                  ? new Date(selected.value)
                  : undefined;
                const isValid = !!(safeDate && !isNaN(safeDate.getTime()));

                return (
                  <div
                    key={item.key}
                    className={[
                      "flex items-center gap-2",
                      // ⬇ full di mobile
                      wrapperClass,
                    ].join(" ")}
                  >
                    {item.dateProps ? (
                      <DatePicker
                        {...item.dateProps}
                        // supaya komponen mengambil lebar penuh

                        selected={(isValid ? safeDate : undefined) as undefined}
                        onDayClick={(d, m, e) => {
                          const formatted = formatDateToMMDDYYYY(
                            d,
                            "YYYY-MM-DD"
                          );
                          setKey(item.key, formatted, formatted);
                          item.dateProps?.onDayClick?.(d, m, e);
                        }}
                      />
                    ) : null}
                  </div>
                );
              })}

              {isReset ? (
                <div className="w-full md:w-28">
                  <Button
                    size="lg"
                    type="button"
                    onClick={reset}
                    title="Reset"
                    variant="danger"
                    className="w-full"
                  >
                    Reset
                  </Button>
                </div>
              ) : null}

              {action?.length ? (
                <div
                  className={
                    // tombol action juga full di mobile
                    "flex flex-col md:flex-row gap-2 w-full md:w-auto"
                  }
                >
                  {action.map((btn, i) => (
                    <Button
                      key={i}
                      {...btn}
                      className={`w-full md:w-auto ${btn.className || ""}`}
                    >
                      {"label" in btn ? btn.label : "Action"}
                    </Button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <div>{children}</div>
      </div>
    );
  }
);

export const CustomSection: React.FC<CustomSectionProps> = (props) => {
  return <Section {...props} />;
};
