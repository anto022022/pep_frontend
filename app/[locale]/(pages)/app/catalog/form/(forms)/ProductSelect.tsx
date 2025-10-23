"use client";
import React from "react";

interface TableDisplayToggleProps {
  onToggle: (val: any) => void;
  value: boolean;
  id: string;
}

export const ProductSelect: React.FC<TableDisplayToggleProps> = ({
  value,
  id,
  onToggle,
}) => {
  return (
    <div className="forms-group f-g-horiz">
      <div className="forms-toggle">
        <input
          id={id}
          type="checkbox"
          checked={value}
          onChange={(e) => {
            e.stopPropagation();
            const checked = e.target.checked;
            onToggle(true);
          }}
        />
        <label htmlFor={id}></label>
      </div>
    </div>
  );
};
