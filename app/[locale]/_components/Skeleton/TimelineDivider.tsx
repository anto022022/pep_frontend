import DatePipe from '@/app/[locale]/_components/Pipe/DatePipe';
import React from 'react';

interface TimeLineDividerProps {
  date: Date |string;
}

const TimeLineDivider: React.FC<TimeLineDividerProps> = ({ date }) => {
  return (
    <div className="timeline-divider-comp">
      <span className="t-d-c-txt">
        <DatePipe value={date} type="date"/>
      </span>
    </div>
  );
};

export default TimeLineDivider;
