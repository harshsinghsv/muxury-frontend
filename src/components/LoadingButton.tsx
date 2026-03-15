import React from 'react';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
}

/**
 * Button component with loading state management
 * Disables button during loading and shows loading indicator
 */
export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText = 'Loading...',
  children,
  disabled,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseClasses = 'h-14 md:h-16 rounded-full font-["DM_Sans"] font-medium flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-[#343434] text-white hover:bg-black',
    secondary: 'bg-[#CA8385] text-white hover:bg-[#B8717E]',
    outline: 'border border-[#343434] text-[#343434] hover:bg-[#F5F0EE]',
  };

  return (
    <button
      disabled={loading || disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="w-4 h-4 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )}
      {loading ? loadingText : children}
    </button>
  );
};

export default LoadingButton;
