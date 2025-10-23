'use client'
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";

interface VirtualScrollerOptions {
    itemSize?: number;
    // You can add more props as needed
};

interface SelectInterface {
    placeholder: string;
    className?: string;
    appendTo?: boolean;
    panelClassName?: string;
    virtualScrollerOptions?: VirtualScrollerOptions;
    filter?: any;
    options: { name: string; value: string; }[];
    editable?: boolean;
};

const Select: React.FC<SelectInterface> = (props) => {
    const { options, placeholder, virtualScrollerOptions, filter, className, panelClassName, appendTo = true, editable = false } = props;
    const [selectedOption, setSelectedOption] = useState(null);

    const getAppendToValue = () => {
        if (appendTo === true) return 'self';
        if (appendTo === false) return undefined;
        return appendTo;
    };

    return (
        <Dropdown
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.value)}
            options={options}
            optionLabel={"name"}
            placeholder={placeholder}
            className={`forms-select-2 ${className}`}
            panelClassName={`dropdown-open ${panelClassName}`}
            appendTo={getAppendToValue()}
            filter={filter}
            virtualScrollerOptions={virtualScrollerOptions}
            editable={editable}
        />
    )
}

export default Select;