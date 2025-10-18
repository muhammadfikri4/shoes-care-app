import React, { useEffect, useRef, useState } from "react";
import { DayPicker, DayPickerProps } from "react-day-picker";
import { BsCalendarDateFill } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import { formatTime } from "../../lib/format-time";

export interface DatePickerProps {
  dropdownState?: (state: boolean) => void;
  selected?: Date;
}

export const DatePicker: React.FC<DatePickerProps & DayPickerProps> = ({
  dropdownState,
  ...rest
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [show, setShow] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
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
    if (rest.selected) {
      setSelectedDate(rest.selected);
    }
  }, [rest.selected]);

  return (
    <>
      <div
        ref={ref}
        className={`relative w-full bg-white z-[${isFocused ? "50" : "20"}]`}
      >
        <div
          onClick={() => {
            setShow((prev) => !prev);
            dropdownState?.(show);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`relative border border-solid border-gray-300 z-${
            isFocused ? "50" : "10"
          } w-full rounded-lg flex items-center justify-between px-4 py-2 cursor-pointer`}
        >
          <div className="flex items-center gap-2">
            <BsCalendarDateFill
              className={`${selectedDate ? "" : "text-gray-500"}`}
            />
            <p
              className={`text-sm font-poppins font-medium duration-200 ${
                selectedDate ? "" : "opacity-50"
              }`}
            >
              {selectedDate ? formatTime(selectedDate, false) : "Select Date"}
            </p>
          </div>
          <MdKeyboardArrowDown
            className={`text-2xl text-gray-500 duration-300 ${
              show ? "rotate-180" : ""
            }`}
          />
        </div>
        {show && (
          <div className="relative z-20">
            <div className="absolute z-20 overflow-auto max-h-96 flex flex-col gap-1 w-full mt-2 pb-2">
              <div className="bg-white w-max p-4 rounded-md shadow-md">
                <DayPicker
                  {...rest}
                  onDayClick={(date, modifiers, e) => {
                    setSelectedDate(date);
                    rest.onDayClick?.(date, modifiers, e);
                    setShow((prev) => !prev);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
