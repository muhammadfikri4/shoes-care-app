import clsx from "clsx";
import dayjs from "dayjs";
import "dayjs/locale/id";
import localeData from "dayjs/plugin/localeData";
import React, { useEffect, useRef, useState } from "react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { TiCalendarOutline } from "react-icons/ti";
import { Button } from "../Button";

dayjs.extend(localeData);
dayjs.locale("id");

type Mode = "days" | "months" | "years";

interface DatePickerProps {
  range?: boolean;
  value?: { start?: Date; end?: Date };
  defaultValue?: { start: Date; end?: Date };
  onChange?: (date: { start: Date; end?: Date }) => void;
  placeholder?: string;
  initialMode?: Mode;
}

export const CustomDatePicker: React.FC<DatePickerProps> = ({
  range = false,
  value,
  defaultValue,
  onChange,
  placeholder = "Select date",
  initialMode = "months",
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [viewDate, setViewDate] = useState(dayjs());
  const [selectedStart, setSelectedStart] = useState<Date | null>(
    value?.start || defaultValue?.start || null
  );
  const [selectedEnd, setSelectedEnd] = useState<Date | null>(
    value?.end || defaultValue?.end || null
  );

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value?.start || value?.end) {
      if (value?.start) {
        setSelectedStart(value.start);
        setViewDate(dayjs(value.start));
      } else {
        setSelectedStart(null);
      }
      setSelectedEnd(value?.end ?? null);
    } else {
      // Filter direset: kosongkan semua agar display text hilang
      setSelectedStart(null);
      setSelectedEnd(null);
    }
  }, [value]);

  const handleSelect = (date: Date) => {
    if (!range) {
      setSelectedStart(date);
      onChange?.({ start: date });
      setTimeout(() => setShowPicker(false), 100);
    } else {
      if (!selectedStart || (selectedStart && selectedEnd)) {
        setSelectedStart(date);
        setSelectedEnd(null);
      } else {
        if (date < selectedStart) {
          setSelectedEnd(selectedStart);
          setSelectedStart(date);
        } else {
          setSelectedEnd(date);
        }
        onChange?.({ start: selectedStart, end: date });
      }
    }
  };

  const prev = () => {
    if (mode === "years") setViewDate(viewDate.subtract(12, "year"));
    else if (mode === "months") setViewDate(viewDate.subtract(1, "year"));
    else setViewDate(viewDate.subtract(1, "month"));
  };

  const next = () => {
    if (mode === "years") setViewDate(viewDate.add(12, "year"));
    else if (mode === "months") setViewDate(viewDate.add(1, "year"));
    else setViewDate(viewDate.add(1, "month"));
  };

  const months = dayjs.monthsShort();

  const renderMonths = () => (
    <div className="grid grid-cols-3 gap-2 mt-4">
      {months.map((m, i) => {
        const date = viewDate.month(i).toDate();

        const isStart =
          selectedStart &&
          selectedStart.getMonth() === i &&
          selectedStart.getFullYear() === viewDate.year();

        const isEnd =
          selectedEnd &&
          selectedEnd.getMonth() === i &&
          selectedEnd.getFullYear() === viewDate.year();

        const isSelected = isStart || isEnd;
        const isInRange =
          range &&
          selectedStart &&
          selectedEnd &&
          date > selectedStart &&
          date < selectedEnd;

        return (
          <button
            key={m}
            onClick={() => handleSelect(date)}
            className={clsx(
              "py-2 rounded-lg font-normal text-sm transition",
              isSelected
                ? "bg-blue-500 text-white"
                : isInRange
                ? "bg-blue-100 text-gray-700"
                : "hover:bg-gray-100"
            )}
          >
            {m}
          </button>
        );
      })}
    </div>
  );

  const renderYears = () => {
    const startYear = Math.floor(viewDate.year() / 12) * 12;
    return (
      <div className="grid grid-cols-3 gap-2 mt-4">
        {Array.from({ length: 12 }).map((_, i) => {
          const year = startYear + i;
          const date = viewDate.year(year).toDate();

          const isStart = selectedStart && selectedStart.getFullYear() === year;

          const isEnd = selectedEnd && selectedEnd.getFullYear() === year;

          const isSelected = isStart || isEnd;
          const isInRange =
            range &&
            selectedStart &&
            selectedEnd &&
            year > selectedStart.getFullYear() &&
            year < selectedEnd.getFullYear();

          return (
            <button
              key={year}
              onClick={() => handleSelect(date)}
              className={clsx(
                "py-2 rounded-lg font-medium transition",
                isSelected
                  ? "bg-blue-500 text-white"
                  : isInRange
                  ? "bg-blue-100 text-gray-700"
                  : "hover:bg-gray-100"
              )}
            >
              {year}
            </button>
          );
        })}
      </div>
    );
  };

  const renderDays = () => {
    const startOfMonth = viewDate.startOf("month");
    const daysInMonth = viewDate.daysInMonth();
    const blanks = Array.from({ length: startOfMonth.day() }).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) =>
      startOfMonth.add(i, "day").toDate()
    );

    return (
      <div className="grid grid-cols-7 gap-1 mt-4 text-center text-sm">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="font-medium text-gray-500">
            {d}
          </div>
        ))}
        {blanks.map((_, i) => (
          <div key={`b${i}`} />
        ))}
        {days.map((date) => {
          const isStart =
            selectedStart &&
            date.getDate() === selectedStart.getDate() &&
            date.getMonth() === selectedStart.getMonth() &&
            date.getFullYear() === selectedStart.getFullYear();

          const isEnd =
            selectedEnd &&
            date.getDate() === selectedEnd.getDate() &&
            date.getMonth() === selectedEnd.getMonth() &&
            date.getFullYear() === selectedEnd.getFullYear();

          const isSelected = isStart || isEnd;
          const isInRange =
            range &&
            selectedStart &&
            selectedEnd &&
            date > selectedStart &&
            date < selectedEnd;

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleSelect(date)}
              className={clsx(
                "py-2 rounded-lg transition",
                isSelected
                  ? "bg-blue-500 text-white"
                  : isInRange
                  ? "bg-blue-100 text-gray-700"
                  : "hover:bg-gray-100"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    );
  };

  const renderPicker = () => (
    <div className="absolute z-[1000] bg-white rounded-2xl shadow-lg p-4 text-center w-[280px] top-full mt-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 flex items-center">
          <Button
            onClick={prev}
            size="sm"
            variant="secondary"
            rounded="full"
            // className="w-auto px-2 py-1"
          >
            <BiChevronLeft size={18} />
          </Button>
        </div>
        <h2
          className="font-medium text-sm cursor-pointer select-none"
          onClick={() =>
            setMode(
              mode === "days" ? "months" : mode === "months" ? "years" : "days"
            )
          }
        >
          {mode === "years"
            ? `${Math.floor(viewDate.year() / 12) * 12} - ${
                Math.floor(viewDate.year() / 12) * 12 + 11
              }`
            : mode === "months"
            ? viewDate.year()
            : viewDate.format("MMMM YYYY")}
        </h2>
        <div className="w-10 h-10 flex items-center">
          <Button
            onClick={next}
            size="sm"
            variant="secondary"
            rounded="full"
            // className="w-auto px-2 py-1"
          >
            <BiChevronRight size={18} />
          </Button>
        </div>
      </div>

      {mode === "days" && renderDays()}
      {mode === "months" && renderMonths()}
      {mode === "years" && renderYears()}
    </div>
  );

  const displayText = () => {
    // range
    // ? selectedStart && selectedEnd
    //   ? `${dayjs(selectedStart).format("DD MMM YYYY")} - ${dayjs(
    //       selectedEnd
    //     ).format("DD MMM YYYY")}`
    //   : selectedStart
    //   ? dayjs(selectedStart).format("DD MMM YYYY")
    //   : ""
    // : selectedStart
    // ? dayjs(selectedStart).format("DD MMM YYYY")
    // : "";
    if (range) {
      if (selectedStart && selectedEnd) {
        return `${dayjs(selectedStart).format(
          initialMode === "days"
            ? "DD MMM YYYY"
            : initialMode === "months"
            ? "MMM YYYY"
            : "YYYY"
        )} - ${dayjs(selectedEnd).format("DD MMM YYYY")}`;
      }

      if (selectedStart) {
        return dayjs(selectedStart).format("DD MMM YYYY");
      }

      return "";
    }

    return selectedStart ? dayjs(selectedStart).format("DD MMM YYYY") : "";
  };

  return (
    <div className="relative inline-block" ref={wrapperRef}>
      {/* <BsCalendarDateFill style={{ position: "absolute", top: 10, left: 12 }} /> */}
      <TiCalendarOutline style={{ position: "absolute", top: 10, left: 12 }} />
      {/* <TiCalendarOutline /> */}
      <input
        readOnly
        onClick={() => setShowPicker((v) => !v)}
        value={displayText()}
        placeholder={placeholder}
        className={clsx(
          `text-sm border placeholder:pl-6 rounded-lg px-3 py-2 cursor-pointer bg-white text-gray-700 transition-all duration-150 outline-none w-full placeholder:font-light placeholder:text-sm min-w-64 ${
            displayText() ? "pl-10" : ""
          }`,
          showPicker
            ? "border-blue-400 ring-2 ring-blue-200"
            : "border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        )}
      />
      {showPicker && renderPicker()}
    </div>
  );
};
