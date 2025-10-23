import React, { PropsWithChildren } from 'react';
import Typography from '../../Base/Typography';
export interface FormTitleInterface {
    variant?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "div";
    className?: string;
    text: string;
}

const FormTitle: React.FC<PropsWithChildren<FormTitleInterface>> = ({ children, variant, className, text }) => {
    return (
        <div className='form-title-comp'>
            {children}
            <Typography variant={variant} className={`f-t-c ${className}`}>{text}</Typography>
        </div>
    );
}


export default FormTitle