import React from 'react';
import { iconPaths, IconName } from '@/utils/iconPaths';

interface IconProps {
  /**
   * Name of the icon from the icons library
   * @example "heart", "home", "back"
   */
  name: IconName;

  /**
   * Size of the icon in pixels or Tailwind size class
   * @example "w-6 h-6" or "24"
   */
  size?: string | number;

  /**
   * Custom CSS class for styling
   */
  className?: string;

  /**
   * Alternative text for accessibility
   */
  alt?: string;

  /**
   * Whether to show as a button
   */
  asButton?: boolean;

  /**
   * Click handler if asButton is true
   */
  onClick?: () => void;

  /**
   * Color to apply to the icon (via CSS filter or direct styling)
   * @example "#CA8385" or "text-[#CA8385]"
   */
  color?: string;
}

/**
 * Reusable Icon component for displaying SVG icons from public/icons
 * @example
 * <Icon name="heart" size="w-6 h-6" className="text-[#CA8385]" />
 * <Icon name="home" size={24} />
 * <Icon name="back" asButton onClick={() => navigate(-1)} />
 */
export const Icon = React.forwardRef<HTMLImageElement, IconProps>(
  (
    {
      name,
      size = 'w-6 h-6',
      className = '',
      alt = name,
      asButton = false,
      onClick,
      color,
    },
    ref
  ) => {
    // Convert numeric size to Tailwind classes
    const sizeClass = typeof size === 'number' ? `w-${size} h-${size}` : size;

    const imgElement = (
      <img
        ref={ref}
        src={iconPaths[name]}
        alt={alt}
        className={`${sizeClass} ${className} object-contain`}
        style={color ? { filter: `invert(0)` } : undefined}
        title={alt}
      />
    );

    if (asButton) {
      return (
        <button
          onClick={onClick}
          className={`flex items-center justify-center rounded-full active:scale-95 transition-transform p-1 hover:opacity-75 ${className}`}
          aria-label={alt}
        >
          {imgElement}
        </button>
      );
    }

    return imgElement;
  }
);

Icon.displayName = 'Icon';

export default Icon;
