/**
 * Batch sync helpers for Cart and Wishlist
 * Reduces N+1 API calls and centralizes sync logic
 */

import api from './api';
import type { CartItem } from '@/context/CartContext';

export const SYNC_ENDPOINTS = {
  CART: {
    CLEAR: '/cart/clear',
    ITEMS: '/cart/items',
  },
  WISHLIST: {
    ADD: '/wishlist/add',
  },
} as const;

/**
 * Sync cart items efficiently.
 * Clears backend cart and adds all items in parallel requests.
 */
export async function syncCartWithBackend(items: CartItem[]): Promise<void> {
  try {
    // Clear backend cart
    await api.delete(SYNC_ENDPOINTS.CART.CLEAR).catch(err => {
      console.error('Failed to clear backend cart:', err);
    });

    if (items.length === 0) return;

    // Sync all items in parallel (better than sequential)
    const results = await Promise.allSettled(
      items.map(item =>
        api.post(SYNC_ENDPOINTS.CART.ITEMS, {
          productId: item.product.id,
          quantity: item.quantity,
          size: item.selectedSize,
        })
      )
    );

    // Log failures for debugging
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      console.error(`Failed to sync ${failures.length}/${items.length} cart items`, failures);
    }
  } catch (error) {
    console.error('Failed to sync cart with backend:', error);
  }
}

/**
 * Sync wishlist items.
 * Adds all product IDs in parallel requests.
 */
export async function syncWishlistWithBackend(productIds: string[]): Promise<void> {
  try {
    if (productIds.length === 0) return;

    const results = await Promise.allSettled(
      productIds.map(productId =>
        api.post(SYNC_ENDPOINTS.WISHLIST.ADD, { productId })
      )
    );

    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      console.error(`Failed to sync ${failures.length}/${productIds.length} wishlist items`, failures);
    }
  } catch (error) {
    console.error('Failed to sync wishlist with backend:', error);
  }
}
