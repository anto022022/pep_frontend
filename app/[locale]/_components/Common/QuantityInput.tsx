"use client";
import ButtonIcon from "@/app/[locale]/_components/Buttons/ButtonIcon";
import {
  MinusIcon,
  PlusQuanIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import React from "react";

const QuantityInput = ({
  quantity,
  onChange,
  disabled = false,
}: {
  quantity: number;
  onChange: (newQty: number) => void;
  disabled?: boolean;
}) => {
  const handleDecrement = () => {
    if (!disabled) onChange(Math.max(quantity - 1, 0));
  };
  const handleIncrement = () => {
    if (!disabled) onChange(quantity + 1);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const value = parseInt(e.target.value, 10);
    onChange(isNaN(value) ? 0 : value);
  };

  return (
    <div className="quantity-comp">
      <ButtonIcon
        className="b-c-icon minus-icon"
        onClick={handleDecrement}
        disabled={disabled}
      >
        <MinusIcon />
      </ButtonIcon>
      <div className={`input-wrapper`}>
        <InputField
          value={quantity}
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>
      <ButtonIcon
        className="b-c-icon plus-icon"
        onClick={handleIncrement}
        disabled={disabled}
      >
        <PlusQuanIcon />
      </ButtonIcon>
    </div>
  );
};

export default QuantityInput;
