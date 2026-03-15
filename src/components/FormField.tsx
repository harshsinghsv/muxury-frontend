import React, { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable form field wrapper with label, error message, and help text
 * Provides consistent form styling and validation feedback
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helpText,
  required,
  children,
  className = '',
}) => {
  return (
    <div className={`mb-4 md:mb-6 ${className}`}>
      <label className="block text-sm font-medium font-['DM_Sans'] text-[#343434] mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {children}
      </div>
      {error && (
        <p className="text-red-500 text-xs font-['DM_Sans'] mt-1.5 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18.101 12.93a1 1 0 00-1.414-1.414L10 16.586l-6.687-6.687a1 1 0 00-1.414 1.414l8.1 8.1a1 1 0 001.414 0l8.1-8.1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-[#999999] text-xs font-['DM_Sans'] mt-1.5">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default FormField;
