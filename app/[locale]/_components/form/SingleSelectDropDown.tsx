'use client'
import { VirtualScrollerProps } from 'primereact/virtualscroller'
import { Dropdown } from 'primereact/dropdown'
import React, { useState } from 'react'

const SingleSelectDropDown = ({ options, optionLabel, optionValue, value, onChange, className, itemTemplate, disabled, virtualScrollerOptions, placeholder, filter, editable }: { options: any[], optionLabel: string, optionValue: string, value: any, onChange: (e: any) => void, className?: string, itemTemplate?: (item: any) => React.ReactNode, disabled?: boolean, virtualScrollerOptions?: VirtualScrollerProps, placeholder?: string, filter?: boolean, editable?: boolean }) => {
    const [internalValue, setInternalValue] = useState<any>(value)
    const handleChange = (e: any) => {
        setInternalValue(e.value)
        onChange?.(e)
    }
    return (
        <Dropdown
            className={`forms-select-2 ${className}`}
            options={options}
            optionLabel={optionLabel}
            optionValue={optionValue}
            value={value ?? internalValue}
            onChange={handleChange}
            itemTemplate={itemTemplate}
            disabled={disabled}
            placeholder={placeholder}
            filter={filter}
            virtualScrollerOptions={virtualScrollerOptions}
            appendTo={"self"}
            panelClassName="custom-dropdown"
            editable={editable}
        />
    )
}

export default SingleSelectDropDown