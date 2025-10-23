"use client";
import React, { FC } from "react";
import { Calendar } from "primereact/calendar";

interface DateTimePickerCalenderInterface {
  placeholder?: string;
  value: Date | undefined;
  onChange: (value: Date | null) => void;
  showTime?: boolean;
  disabled?: boolean;
  dateFormat?: string;
  maxDate?: Date;
}
const DateTimePickerCalender: FC<DateTimePickerCalenderInterface> = ({
  placeholder,
  value,
  onChange,
  showTime = false,
  disabled = false,
  dateFormat,
  maxDate,
}) => {
  return (
    <>
      <Calendar
        id="calendar-12h"
        value={value}
        onChange={(e) => {
          const val = e.value instanceof Date ? e.value : null;
          onChange(val);
        }}
        showTime={showTime}
        hourFormat="12"
        // appendTo={'self'}
        className="datetimepicker-comp"
        placeholder={placeholder ?? "Select Time Duration"}
        disabled={disabled}
        dateFormat={dateFormat ?? "dd/mm/yy"}
        maxDate={maxDate}
      />
    </>
  );
};

export default DateTimePickerCalender;
