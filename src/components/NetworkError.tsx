import React from 'react';

interface NetworkErrorProps {
  message?: string;
  onRetry?: () => void;
  variant?: 'inline' | 'full-page';
}

/**
 * Network error display component
 * Shows message and retry option when API calls fail
 */
export const NetworkError: React.FC<NetworkErrorProps> = ({
  message = 'Failed to load data. Please check your connection and try again.',
  onRetry,
  variant = 'inline',
}) => {
  if (variant === 'full-page') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-5">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16H5m13.6-9.6L19 5m-3 5h4m-3 0h5m-6 0h4m0 0V7" />
            </svg>
          </div>
          <h1 className="font-['Playfair_Display'] text-2xl font-bold text-[#343434] mb-2">
            Network Error
          </h1>
          <p className="font-['DM_Sans'] text-[#999999] text-sm mb-6">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full bg-[#343434] text-white font-['DM_Sans'] font-medium py-3 rounded-full hover:bg-black transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-orange-50 border border-orange-200 rounded-2xl p-4 md:p-6">
      <div className="flex gap-4">
        <svg className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M12 5a7 7 0 110 14 7 7 0 010-14z" />
        </svg>
        <div className="flex-1">
          <h3 className="font-['DM_Sans'] font-medium text-orange-900 mb-1">Connection Error</h3>
          <p className="font-['DM_Sans'] text-sm text-orange-700 mb-3">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm font-medium text-orange-600 hover:text-orange-700 underline"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkError;
