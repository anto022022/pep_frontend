"use client";
import React from "react";

interface TableDisplayToggleProps {
  onToggle: (val: any) => void;
  value: boolean;
  id: string;
  disabled?: boolean;
}

export const TableDisplayToggle: React.FC<TableDisplayToggleProps> = ({
  value,
  id,
  onToggle,
  disabled
}) => {

  return (
    <div className="forms-group f-g-horiz">
      <div className="forms-toggle">
        <input
          id={id}
          type="checkbox"
          checked={value ?? false}
          disabled={disabled}
          onChange={(e) => {
            e.stopPropagation();
            const checked = e.target.checked;
            onToggle(checked);
          }}
        />
        <label htmlFor={id}></label>
      </div>
    </div>
  );
};
