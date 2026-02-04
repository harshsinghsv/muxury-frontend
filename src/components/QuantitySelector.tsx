import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
}

const QuantitySelector = ({
    value,
    onChange,
    min = 1,
    max = 99,
    disabled = false,
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

    return (
        <div className="flex items-center border border-border rounded-md">
            <button
                type="button"
                onClick={handleDecrease}
                disabled={disabled || value <= min}
                className="p-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
            >
                <Minus size={16} />
            </button>
            <span className="w-12 text-center font-medium tabular-nums">{value}</span>
            <button
                type="button"
                onClick={handleIncrease}
                disabled={disabled || value >= max}
                className="p-2 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Increase quantity"
            >
                <Plus size={16} />
            </button>
        </div>
    );
};

export default QuantitySelector;
