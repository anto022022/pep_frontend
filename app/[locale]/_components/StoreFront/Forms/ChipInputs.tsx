"use client";
import { Chips } from "primereact/chips";
import React from "react";

interface ChipInputsProps {
  value: any[];
  onFocus?: () => void;
  onChange: (value: any[]) => void;
  className?: string;
  placeholder?: string;
  handleOnAdd: (e: any) => void;
  handleOnRemove: (e: any) => void;
  itemTemplate: (item: any) => React.ReactNode;
  helperText?: string;
  error?: boolean;
}

const ChipInputs: React.FC<ChipInputsProps> = ({
  className,
  onChange,
  value = [],
  placeholder,
  handleOnAdd,
  handleOnRemove,
  itemTemplate,
  onFocus,
  helperText,
  error,
}) => {
  return (
    <>
      <Chips
        value={value}
        onFocus={onFocus}
        onAdd={(e) => handleOnAdd(e.value)}
        onRemove={(e) => handleOnRemove(e.value)}
        onChange={(e) => {
          onChange(e.value || []);
        }}
        className={`forms-input f-i-chip ${className}`}
        placeholder={placeholder}
        itemTemplate={itemTemplate}
      />
      {helperText && (
        <small className={`helper-text ${error ? "error-text" : ""}`}>
          {helperText}
        </small>
      )}
    </>
  );
};

export default ChipInputs;
