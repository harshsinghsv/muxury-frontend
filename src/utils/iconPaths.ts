/**
 * Centralized mapping of all icon assets from public/icons folder
 * Use this to reference icons throughout the app
 */

export const iconPaths = {
  // Navigation & UI
  home: '/icons/Home.svg',
  back: '/icons/Icon - Back.svg',
  backAlt: '/icons/Icon - Back-1.svg',
  close: '/icons/close.svg',
  next: '/icons/Right Actionable.svg',
  plus: '/icons/Icon - Plus.svg',

  // E-commerce
  heart: '/icons/Heart.svg',
  bag: '/icons/Bag.svg',
  buy: '/icons/Buy.svg',
  category: '/icons/Category.svg',

  // Account & Profile
  avatar: '/icons/Avatar.svg',
  profile: '/icons/Icon - Profile.svg',
  setting: '/icons/Setting.svg',

  // Security & Alerts
  lock: '/icons/Icon - Lock.svg',
  security: '/icons/Icon - Security.svg',
  notification: '/icons/Icon - Notification.svg',
  help: '/icons/Icon - Help.svg',
  info: '/icons/Icon - Information.svg',

  // Finance
  wallet: '/icons/Icon - Wallet.svg',

  // Ratings
  star: '/icons/Icon - Star.svg',

  // Auth
  show: '/icons/Show.svg',
  document: '/icons/Document.svg',
} as const;

export type IconName = keyof typeof iconPaths;

/**
 * Get icon path by name
 * @example getIconPath('heart')
 */
export const getIconPath = (name: IconName): string => {
  return iconPaths[name];
};
