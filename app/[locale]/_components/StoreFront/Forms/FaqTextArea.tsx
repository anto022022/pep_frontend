import React from 'react';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';
interface TextAreaProps {
    name: string;
    onClick?: (e: React.MouseEvent) => void;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    register: UseFormRegister<any>;
    validation?: RegisterOptions;
    placeholder?: string;
    type?: string;
    className?: string;
    loading?: boolean;

}
const FaqTextArea: React.FC<TextAreaProps> = ({
    name,
    register,
    validation,
    placeholder,
    type = "text",
    className,
    onClick,
    onBlur,
    loading,
}) => {

    const registerProps = register(name, {
        ...validation,
        setValueAs: (value) =>
            type === "number" && value !== undefined ? Number(value) : value,
    });
    return (
        <div className={`textarea-comp ${className}`}>
            <div className='input-ai-block'>
                <textarea
                    {...registerProps}
                    name={name}
                    className='forms-textarea'
                    placeholder={placeholder} 
                    onClick={(e) => onClick && onClick(e)}
                    onBlur={(e) => {
                        onBlur?.(e);
                        registerProps.onBlur?.(e);
                    }}
                    disabled={loading}

                ></textarea>
            </div>
        </div>
    )
}

export default FaqTextArea