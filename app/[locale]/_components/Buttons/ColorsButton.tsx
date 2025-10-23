'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface ColorItem {
  name: string;
  img: string;
  selected?: boolean;
}

interface ColorsButtonProps {
  data: ColorItem[];
  className?: string;
}

const ColorsButton: React.FC<ColorsButtonProps> = ({ data, className = '' }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    const selectedItemColor = data.find((item) => item.selected);
    if (selectedItemColor) {
      const index = data.findIndex((item) => item.name === selectedItemColor.name);
      setSelectedIndex(index);
    } else {
      setSelectedIndex(0);
    }
  }, [data]);

  const handleColorClick = (index: number): void => {
    setSelectedIndex(index);
  };

  return (
    <div className={`sizesbutton-comp colorsbutton-comp ${className}`}>
      <label className="s-c-label">
        Color ({data.length})
        {selectedIndex !== null ? `: ${data[selectedIndex]?.name}` : ''}
      </label>
      <div className="s-c-buttons-block">
        {data.map((item, index) => (
          <div
            key={item.name}
            className={`c-c-img ${selectedIndex === index ? 'selected' : ''}`}
            onClick={() => handleColorClick(index)}
          >
            <Image
              src={item.img}
              alt={item.name}
              width={26}
              height={26}
              sizes="100vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorsButton;
