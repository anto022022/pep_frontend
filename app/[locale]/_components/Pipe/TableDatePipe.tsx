import React from "react";

interface DatePipeProps {
  date: string;
}

export const TableDatePipe: React.FC<DatePipeProps> = ({ date }) => {
  const utcDate = new Date(date);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const localDate = new Date(utcDate.toLocaleString("en-US", { timeZone }));

  const day = String(localDate.getDate()).padStart(2, "0");
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const year = localDate.getFullYear();
  return day && month && year ? `${day}/${month}/${year}` : "-";
};
