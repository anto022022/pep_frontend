'use client'
import React, { useState } from 'react';

interface InputsInterface {
    type: string;
    name?: string;
    className?: string;
    placeholder?: string;
    helperTxt?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (status: any) => void;
    rest?: any
    isError?: boolean
};

const Inputs: React.FC<InputsInterface> = (props) => {
    const {
        type,
        className,
        name,
        placeholder,
        helperTxt,
        value,
        defaultValue,
        onChange,
        isError = false,
        ...rest
    } = props;

    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isFilled, setIsFilled] = useState(!!value || !!defaultValue);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e) => {
        setIsFocused(false);
        setIsFilled(!!e.target.value);
    };

    return (
        <div className={`input-wrapper ${className} ${isError ? 'error-active' : ''}`}>
            <input type={type} id={placeholder} placeholder={placeholder} className={`forms-input ${className}`}
                value={value} defaultValue={defaultValue} onChange={(e) => {
                    setIsFilled(!!e.target.value);
                    onChange?.(e);
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                name={name}
                {...rest} />
            {helperTxt &&
                <label htmlFor={placeholder} className={`floating-txt ${isFocused || isFilled ? 'active' : ''}`}>{helperTxt}</label>
            }
        </div>
    )
}

export default Inputs