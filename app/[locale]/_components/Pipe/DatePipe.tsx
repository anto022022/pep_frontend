import React from 'react';

type DatePipeType = 'date' | 'time' | 'day' | 'datetime' | 'customDayMonth' | 'longFormat' | 'shortDate';

interface DatePipeProps {
  value: string | Date;
  type?: DatePipeType;
  locale?: string;
  customFormat?: Intl.DateTimeFormatOptions;
}

const formatMap: Record<Exclude<DatePipeType, 'customDayMonth' | 'longFormat'|'shortDate'>, Intl.DateTimeFormatOptions> = {
  date: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
  time: {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  },
  day: {
    weekday: 'long',
  },
  datetime: {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  },
};

const getOrdinal = (n: number) => {
  if (n >= 11 && n <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
};

const DatePipe: React.FC<DatePipeProps> = ({
  value,
  type = 'datetime',
  locale = 'default',
  customFormat,
}) => {
  const date = new Date(value);

  let formatted = '';

  if (type === 'customDayMonth') {
    const day = date.getDate();
    const month = date.toLocaleString(locale, { month: 'long' });
    formatted = `${getOrdinal(day)} ${month}`;
  } 
  
  else if (type === 'longFormat') {
    // 👉 Special format: Apr 14, 2024 at 8.00 pm GMT+8
    const datePart = new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(date);

    const timePart = new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
      .format(date)
      .replace(':', '.'); // replace colon with dot

    // timezone offset
    const tzOffset = -date.getTimezoneOffset();
    const sign = tzOffset >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(tzOffset) / 60);

    const gmtPart = `GMT${sign}${hours}`;

    formatted = `${datePart} at ${timePart} ${gmtPart}`;
  }
  else if (type === 'shortDate') {
  // 👉 Apr 14, 2024
  formatted = new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
}

  else {
    const format = customFormat || formatMap[type];
    formatted = new Intl.DateTimeFormat(locale, format).format(date);
  }

  return <>{formatted}</>;
};

export default DatePipe;
