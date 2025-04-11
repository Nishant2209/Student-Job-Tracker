import React, { useState, useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format, parseISO, isValid } from "date-fns";

interface DatePickerInputProps {
  value: string;
  onChange: (date: string) => void;
  label: string;
}

export function DatePickerInput({
  value,
  onChange,
  label,
}: DatePickerInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(
    value ? format(parseISO(value), "yyyy-MM-dd") : ""
  );
  const datePickerRef = useRef<HTMLDivElement>(null);
  const selected = value ? parseISO(value) : undefined;
  const [displayMonth, setDisplayMonth] = useState<Date>(
    selected || new Date()
  );
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (value === "") {
      setInputValue("");
    } else {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        setInputValue(format(parsed, "yyyy-MM-dd"));
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    try {
      const date = parseISO(e.target.value);
      if (isValid(date)) {
        onChange(format(date, "yyyy-MM-dd"));
      }
    } catch (error) {
      // Invalid date format, ignore
    }
  };

  return (
    <div className="relative">
      <label className="text-sm text-gray-400">{label}</label>
      <div className="relative">
        <input
          type="text"
          className="neo-input pr-10"
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => setIsOpen(true)}
        />
        <Calendar
          size={18}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && (
        <div ref={datePickerRef} className="date-picker-wrapper">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                const formattedDate = format(date, "yyyy-MM-dd");
                setInputValue(formattedDate);
                onChange(formattedDate);
                setIsOpen(false);
              }
            }}
            month={displayMonth} // 👈 control the visible calendar month
            onMonthChange={setDisplayMonth} // 👈 keep track when it changes internally
            components={{
              Caption: () => (
                <div className="flex justify-between items-center mb-4">
                  <select
                    value={displayMonth.getMonth()}
                    onChange={(e) => {
                      const newMonth = new Date(
                        displayMonth.getFullYear(),
                        parseInt(e.target.value),
                        1
                      );
                      setDisplayMonth(newMonth); // 👈 update calendar display
                    }}
                    className="neo-input py-1 px-2 mr-2"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {format(new Date(2000, i, 1), "MMMM")}
                      </option>
                    ))}
                  </select>
                  <select
                    value={displayMonth.getFullYear()}
                    onChange={(e) => {
                      const newYear = new Date(
                        parseInt(e.target.value),
                        displayMonth.getMonth(),
                        1
                      );
                      setDisplayMonth(newYear); // 👈 update calendar display
                    }}
                    className="neo-input py-1 px-2"
                  >
                    {Array.from({ length: 11 }, (_, i) => (
                      <option key={i} value={currentYear - 10 + i}>
                        {currentYear - 10 + i}
                      </option>
                    ))}
                  </select>
                </div>
              ),
            }}
          />
        </div>
      )}
    </div>
  );
}
