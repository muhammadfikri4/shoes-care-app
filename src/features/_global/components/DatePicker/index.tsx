import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";

type DatePickerMode = "date" | "month" | "year";
type DateRange = [Date | null, Date | null];

interface DatePickerProps {
  mode?: DatePickerMode;
  range?: boolean;
  onChange?: (date: Date | DateRange) => void;
  // Legacy props (deprecated but still supported)
  initialStartDate?: Date;
  initialEndDate?: Date;
  // New value props
  value?: Date | DateRange;
  defaultValue?: Date | DateRange;
  className?: string;
  placeholder?: string;
  displayFormat?: string;
  width?: string;
  fullWidth?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  mode = "date",
  range = false,
  onChange,
  // Legacy props
  initialStartDate,
  initialEndDate,
  // New props
  value,
  defaultValue,
  className = "",
  placeholder = "Select date",
  displayFormat = "MMM dd, yyyy",
  width = "100%",
  fullWidth = true,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<DatePickerMode>(mode);
  // Helper function to validate and convert date
  const validateDate = (date: Date | undefined | null): Date | null => {
    if (!date) return null;

    // Handle case when date is already a Date object
    if (date instanceof Date) {
      return isNaN(date.getTime()) ? null : date;
    }

    // Handle string dates
    if (typeof date === "string") {
      const parsed = new Date(date);
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    // Handle number timestamps
    if (typeof date === "number") {
      return new Date(date);
    }

    return null;
  };

  // Initialize state based on props
  const getInitialStartDate = (): Date | null => {
    // Priority: value > defaultValue > legacy props
    if (value !== undefined) {
      if (range && Array.isArray(value)) {
        return validateDate(value[0]);
      } else if (!range && !Array.isArray(value)) {
        return validateDate(value);
      }
    }

    if (defaultValue !== undefined) {
      if (range && Array.isArray(defaultValue)) {
        return validateDate(defaultValue[0]);
      } else if (!range && !Array.isArray(defaultValue)) {
        const date = validateDate(defaultValue);
        return date;
      }
    }

    // Fallback to legacy props
    return validateDate(initialStartDate);
  };

  const getInitialEndDate = (): Date | null => {
    if (value !== undefined && range && Array.isArray(value)) {
      return validateDate(value[1]);
    }

    if (defaultValue !== undefined && range && Array.isArray(defaultValue)) {
      return validateDate(defaultValue[1]);
    }

    // Fallback to legacy props
    return validateDate(initialEndDate);
  };

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
    getInitialStartDate()
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
    getInitialEndDate()
  );
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [triggerWidth, setTriggerWidth] = useState(0);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Check if component is controlled
  const isControlled = value !== undefined;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate years from 1900 to 2100
  const years = Array.from({ length: 201 }, (_, i) => 1900 + i);

  // Update internal state when value prop changes (controlled mode)
  useEffect(() => {
    if (isControlled) {
      if (range && Array.isArray(value)) {
        const start = validateDate(value[0]);
        const end = validateDate(value[1]);
        if (start !== selectedStartDate || end !== selectedEndDate) {
          setSelectedStartDate(start);
          setSelectedEndDate(end);
        }
      } else if (!range && !Array.isArray(value)) {
        const date = validateDate(value);
        if (date !== selectedStartDate) {
          setSelectedStartDate(date);
          setSelectedEndDate(null);
        }
      }
    }
  }, [value, range, isControlled]);

  // Close dropdown when clicking outside and measure trigger width
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const measureTrigger = () => {
      if (triggerRef.current) {
        setTriggerWidth(
          fullWidth
            ? triggerRef.current.offsetWidth
            : triggerRef.current.offsetWidth / 2
        );
      }
    };

    measureTrigger();
    window.addEventListener("resize", measureTrigger);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", measureTrigger);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [fullWidth]);

  const navigatePeriod = (direction: number) => {
    const newDate = new Date(currentDate);

    switch (viewMode) {
      case "date":
        newDate.setMonth(newDate.getMonth() + direction);
        break;
      case "month":
        newDate.setFullYear(newDate.getFullYear() + direction);
        break;
      case "year":
        newDate.setFullYear(newDate.getFullYear() + direction * 10);
        break;
    }

    setCurrentDate(newDate);
  };

  const selectDate = (day: number) => {
    const newDate = new Date(
      Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), day)
    );

    if (range) {
      const currentStartDate = getCurrentStartDate();
      const currentEndDate = getCurrentEndDate();

      if (!currentStartDate || (currentStartDate && currentEndDate)) {
        const newRange: DateRange = [newDate, null];
        if (!isControlled) {
          setSelectedStartDate(newDate);
          setSelectedEndDate(null);
        }
        if (onChange) onChange(newRange);
      } else if (newDate > currentStartDate) {
        const newRange: DateRange = [currentStartDate, newDate];
        if (!isControlled) {
          setSelectedEndDate(newDate);
        }
        if (onChange) onChange(newRange);
      } else {
        const newRange: DateRange = [newDate, currentStartDate];
        if (!isControlled) {
          setSelectedEndDate(currentStartDate);
          setSelectedStartDate(newDate);
        }
        if (onChange) onChange(newRange);
      }
    } else {
      if (!isControlled) {
        setSelectedStartDate(newDate);
      }
      if (onChange) onChange(newDate);
      setIsOpen(false);
    }
  };

  const selectMonth = (month: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    setCurrentDate(newDate);
    setViewMode("date");
  };

  const selectYear = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setViewMode("month");
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Get current values (for controlled vs uncontrolled mode)
  const getCurrentStartDate = (): Date | null => {
    if (isControlled) {
      if (range && Array.isArray(value)) {
        return validateDate(value[0]);
      } else if (!range && !Array.isArray(value)) {
        return validateDate(value);
      }
      return null;
    }
    return selectedStartDate;
  };

  const getCurrentEndDate = (): Date | null => {
    if (isControlled && range && Array.isArray(value)) {
      return validateDate(value[1]);
    }
    return selectedEndDate;
  };

  const isDateSelected = (day: number): boolean => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    const currentStartDate = getCurrentStartDate();
    const currentEndDate = getCurrentEndDate();

    if (!range) {
      return (
        currentStartDate !== null &&
        date.getDate() === currentStartDate.getDate() &&
        date.getMonth() === currentStartDate.getMonth() &&
        date.getFullYear() === currentStartDate.getFullYear()
      );
    } else {
      if (!currentStartDate) return false;
      if (!currentEndDate) {
        return (
          date.getDate() === currentStartDate.getDate() &&
          date.getMonth() === currentStartDate.getMonth() &&
          date.getFullYear() === currentStartDate.getFullYear()
        );
      }

      return date >= currentStartDate && date <= currentEndDate;
    }
  };

  const isDateInRange = (day: number): boolean => {
    const currentStartDate = getCurrentStartDate();
    const currentEndDate = getCurrentEndDate();

    if (!range || !currentStartDate || !hoverDate || currentEndDate)
      return false;

    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const start = currentStartDate < hoverDate ? currentStartDate : hoverDate;
    const end = currentStartDate < hoverDate ? hoverDate : currentStartDate;

    return date > start && date < end;
  };

  const isSameMonth = (date1: Date | null, date2: Date | null): boolean => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth()
    );
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    const firstDayOfMonth = getFirstDayOfMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = isDateSelected(day);
      const isInRange = isDateInRange(day);
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <button
          type="button"
          key={`day-${day}`}
          className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm
            ${isToday ? "font-bold border border-blue-500" : ""}
            ${isSelected ? "bg-blue-500 text-white" : ""}
            ${isInRange ? "bg-blue-100" : ""}
            hover:bg-blue-100 transition-colors duration-200`}
          onClick={() => selectDate(day)}
          onMouseEnter={() =>
            range &&
            !getCurrentEndDate() &&
            setHoverDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            )
          }
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const renderMonths = () => {
    const currentStartDate = getCurrentStartDate();

    return months.map((month, index) => {
      const isCurrentMonth = currentDate.getMonth() === index;
      const isSelectedMonth =
        currentStartDate &&
        currentStartDate.getMonth() === index &&
        isSameMonth(currentDate, currentStartDate);

      return (
        <button
          type="button"
          key={month}
          className={`py-2 rounded-md text-sm
            ${isCurrentMonth ? "font-semibold" : ""}
            ${isSelectedMonth ? "bg-blue-500 text-white" : "hover:bg-gray-100"}
            transition-colors duration-200`}
          onClick={() => selectMonth(index)}
        >
          {month.substring(0, 3)}
        </button>
      );
    });
  };

  const renderYears = () => {
    const currentYear = currentDate.getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10;
    const displayedYears = years.slice(
      years.indexOf(startYear),
      years.indexOf(startYear) + 10
    );

    const currentStartDate = getCurrentStartDate();

    return displayedYears.map((year) => {
      const isCurrentYear = currentDate.getFullYear() === year;
      const isSelectedYear =
        currentStartDate &&
        currentStartDate.getFullYear() === year &&
        currentDate.getFullYear() === year;

      return (
        <button
          type="button"
          key={year}
          className={`py-2 rounded-md text-sm
            ${isCurrentYear ? "font-semibold" : ""}
            ${isSelectedYear ? "bg-blue-500 text-white" : "hover:bg-gray-100"}
            transition-colors duration-200`}
          onClick={() => selectYear(year)}
        >
          {year}
        </button>
      );
    });
  };

  const formatHeaderDisplay = (): string => {
    const startYear = Math.floor(currentDate.getFullYear() / 10) * 10;
    switch (viewMode) {
      case "date":
        return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
      case "month":
        return `${currentDate.getFullYear()}`;
      case "year":
        return `${startYear}-${startYear + 9}`;
      default:
        return "";
    }
  };

  const toggleViewMode = () => {
    const nextMode: Record<DatePickerMode, DatePickerMode> = {
      date: "month",
      month: "year",
      year: "date",
    };
    setViewMode(nextMode[viewMode]);
  };

  const formatDisplayDate = (): string => {
    const currentStartDate = getCurrentStartDate();
    const currentEndDate = getCurrentEndDate();

    if (range) {
      if (!currentStartDate) return placeholder;
      if (!currentEndDate) return format(currentStartDate, displayFormat);
      return `${format(currentStartDate, displayFormat)} - ${format(
        currentEndDate,
        displayFormat
      )}`;
    } else {
      return currentStartDate
        ? format(currentStartDate, displayFormat)
        : placeholder;
    }
  };

  return (
    <div
      className={`relative ${className}`}
      ref={datePickerRef}
      style={{ width }}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2 border rounded-md shadow-sm text-left text-sm
          ${
            isOpen
              ? "ring-2 ring-blue-500 border-blue-500"
              : "border-gray-300 hover:border-gray-400"
          }
          focus:outline-none focus:ring-2 focus:ring-blue-500`}
      >
        <span className={`${!getCurrentStartDate() ? "text-gray-400" : ""}`}>
          {formatDisplayDate()}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Picker */}
      {isOpen && (
        <div
          className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg p-4 border border-gray-200"
          style={{ width: triggerWidth }}
        >
          {/* Header with navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigatePeriod(-1)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={toggleViewMode}
              className="font-semibold text-sm px-2 py-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              {formatHeaderDisplay()}
            </button>

            <button
              type="button"
              onClick={() => navigatePeriod(1)}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Body content based on view mode */}
          <div className="mb-2">
            {viewMode === "date" && (
              <>
                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekdays.map((day) => (
                    <div
                      key={day}
                      className="text-xs text-center text-gray-500 font-medium"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
              </>
            )}

            {viewMode === "month" && (
              <div className="grid grid-cols-3 gap-2">{renderMonths()}</div>
            )}

            {viewMode === "year" && (
              <div className="grid grid-cols-5 gap-2">{renderYears()}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
