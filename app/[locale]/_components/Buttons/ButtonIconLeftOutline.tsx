import React from 'react'
import Typography from '../Base/Typography'

export interface buttonIconLeftOutlineInterface {
    type?: "button" | "submit" | "reset" | undefined;
    name?: string;
    className: string;
    children?: React.ReactNode;
    disabled?: boolean;
    onClick?: (() => void) | ((e: React.MouseEvent<HTMLButtonElement>) => void);

}
const ButtonIconLeftOutline: React.FC<buttonIconLeftOutlineInterface> = ({ type = "button", name, className, children, onClick, disabled = false }) => {

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!onClick) return;
        if (onClick.length === 0) {
            // No-arg function
            (onClick as () => void)();
        } else {
            // Function expects event
            (onClick as (e: React.MouseEvent<HTMLButtonElement>) => void)(e);
        }
    };

    return (
        <button
            type={type}
            className={`btn-comp btn-outline btn-left ${className}`}
            onClick={handleClick}
            disabled={disabled}
        >
            {children}
            <Typography variant='span' className='b-c-txt'>{name}</Typography>
        </button>
    )
}

export default ButtonIconLeftOutline