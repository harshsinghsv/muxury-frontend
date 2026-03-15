import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Accessible input component with error state and optional icons
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, icon, iconPosition = 'left', className = '', ...props }, ref) => {
    return (
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full h-14 md:h-16 px-4 md:px-6 rounded-2xl border-2 bg-white text-[#343434] placeholder-[#999999] text-sm md:text-base font-['DM_Sans'] focus:outline-none transition-colors ${
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-[#EBEBEB] focus:border-[#CA8385]'
          } ${icon && iconPosition === 'left' ? 'pl-12 md:pl-16' : ''} ${
            icon && iconPosition === 'right' ? 'pr-12 md:pr-16' : ''
          } ${className}`}
          aria-invalid={error ?? false}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none">
            {icon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
