'use client';
import React, { useState } from 'react';

interface SizeItem {
  sizes: string;
}

interface SizesButtonProps {
  data: SizeItem[];
  className?: string;
}

const SizesButton: React.FC<SizesButtonProps> = ({ data, className = '' }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleClick = (index: number): void => {
    setActiveIndex(index);
  };

  return (
    <div className={`sizesbutton-comp ${className}`}>
      <label className="s-c-label">Size</label>
      <div className="s-c-buttons-block">
        {data.map((item, index) => (
          <button
            key={item.sizes}
            className={`btn-comp ${activeIndex === index ? 'active' : ''}`}
            onClick={() => handleClick(index)}
          >
            {item.sizes}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizesButton;
