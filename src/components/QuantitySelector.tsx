import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
    size?: "sm" | "md";
}

const QuantitySelector = ({
    value,
    onChange,
    min = 1,
    max = 99,
    disabled = false,
    size = "md",
}: QuantitySelectorProps) => {
    const handleDecrease = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const handleIncrease = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    const sizeClasses = size === "sm"
        ? "p-1"
        : "p-2";

    const iconSize = size === "sm" ? 14 : 16;
    const widthClass = size === "sm" ? "w-8" : "w-12";

    return (
        <div className="flex items-center border border-border rounded-md">
            <button
                type="button"
                onClick={handleDecrease}
                disabled={disabled || value <= min}
                className={`${sizeClasses} hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Decrease quantity"
            >
                <Minus size={iconSize} />
            </button>
            <span className={`${widthClass} text-center font-medium tabular-nums text-sm`}>{value}</span>
            <button
                type="button"
                onClick={handleIncrease}
                disabled={disabled || value >= max}
                className={`${sizeClasses} hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Increase quantity"
            >
                <Plus size={iconSize} />
            </button>
        </div>
    );
};

export default QuantitySelector;

