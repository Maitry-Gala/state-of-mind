import { type ReactElement } from "react";

interface ButtonProps {
    variant: "primary" | "secondary";
    text: string;
    startIcon?: ReactElement;
    onClick?: () => void;
    disabled?: boolean;
}

const variantClasses = {
    "primary": "bg-primary text-brand-100",
    "secondary": "bg-secondary text-brand-900",
};

const defaultStyles = `
    px-4 py-2 rounded-md
    flex items-center gap-2
    text-sm font-semibold tracking-wide
    transition-all duration-150 ease-out
    cursor-pointer select-none
    disabled:opacity-50 disabled:pointer-events-none
`;

export function Button({ variant, text, startIcon ,onClick,disabled}: ButtonProps) {
    return (
        <button className={`${variantClasses[variant]} ${defaultStyles}`} onClick={onClick} disabled={disabled}>
            {startIcon}
            {text}
        </button>
    );
}