/**
 * Shop feature exports
 */

// Types
export * from './types';

// Components (excluding CartItem to avoid conflict with type)
export * from './components';
export { CartProvider, useCart, CartIcon, CartDrawer } from './components/cart';
export * from './components/events';

// Hooks
export * from './hooks';
