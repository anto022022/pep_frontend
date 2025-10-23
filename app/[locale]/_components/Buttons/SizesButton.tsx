'use client'
import React, { FC, useState } from 'react';

interface SizeButtonProps {
    data: string[];
    defaultActive: string;
}

const SizesButton: FC<SizeButtonProps> = ({ data=[], defaultActive }) => {
    const [active, setActive] = useState<string>(defaultActive);

    const handleSizes = (size: string) => {
        setActive(size);
    };
    
    return (
        <div className='sizesbutton-comp'>
            <label className='s-c-label'>Available Sizes</label>
            <div className='s-c-buttons-block'>
                {data.map((item, index) => (
                    <button 
                        className={`btn-comp ${active === item ? 'active' : ''}`} 
                        key={index} 
                        onClick={() => handleSizes(item)}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SizesButton;
