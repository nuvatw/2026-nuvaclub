'use client';

import Image from 'next/image';
import type { CartItem as CartItemType } from '@/features/shop/types';
import { useCart } from './CartProvider';
import { MinusIcon, PlusIcon, TrashIcon, CubeIcon } from '@/components/icons';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  // Create identifier for this specific cart item
  const itemIdentifier = {
    productId: item.productId,
    selectedVariant: item.selectedVariant,
    selectedPeriod: item.selectedPeriod,
  };

  return (
    <div className="flex gap-4 py-4 border-b border-neutral-800">
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-800">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500">
            <CubeIcon size="lg" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white truncate">{item.name}</h4>
        {(item.selectedVariant || item.selectedPeriod) && (
          <p className="text-sm text-neutral-400 mt-0.5">
            {item.selectedVariant && <span>{item.selectedVariant}</span>}
            {item.selectedVariant && item.selectedPeriod && <span> / </span>}
            {item.selectedPeriod && <span>{item.selectedPeriod}</span>}
          </p>
        )}
        <p className="text-sm font-semibold text-white mt-1">
          ${item.price.toLocaleString()}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => updateQuantity(itemIdentifier, item.quantity - 1)}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:border-neutral-600 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none transition-all"
            aria-label="Decrease quantity"
          >
            <MinusIcon size="sm" />
          </button>
          <span className="text-sm font-medium text-white min-w-[2ch] text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(itemIdentifier, item.quantity + 1)}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:border-neutral-600 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none transition-all"
            aria-label="Increase quantity"
          >
            <PlusIcon size="sm" />
          </button>
          <button
            onClick={() => removeFromCart(itemIdentifier)}
            className="ml-auto text-neutral-400 hover:text-red-400 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none rounded-lg transition-all p-2"
            aria-label="Remove item"
          >
            <TrashIcon size="md" />
          </button>
        </div>
      </div>
    </div>
  );
}
