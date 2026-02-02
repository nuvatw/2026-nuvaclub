'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCheckout } from '../../context/CheckoutContext';
import { FormInput } from '../ui/FormInput';

// Mock stores for 7-ELEVEN store selector
const MOCK_STORES = [
  { id: '001234', name: 'Taipei Station Store', address: 'No. 3, Beiping W. Rd., Zhongzheng Dist., Taipei City' },
  { id: '001567', name: 'Xinyi Store', address: 'No. 88, Sec. 5, Xinyi Rd., Xinyi Dist., Taipei City' },
  { id: '002345', name: 'Zhongxiao Store', address: 'No. 100, Sec. 4, Zhongxiao E. Rd., Da\'an Dist., Taipei City' },
  { id: '003456', name: 'Nanjing Store', address: 'No. 50, Sec. 3, Nanjing E. Rd., Zhongshan Dist., Taipei City' },
];

export function DeliveryInfoStep() {
  const {
    state,
    setDeliveryInfo,
    usePurchaserInfoForDelivery,
    getCurrentStep,
  } = useCheckout();
  const step = getCurrentStep();
  const { deliveryInfo } = state;
  const [showStoreSelector, setShowStoreSelector] = useState(false);

  const handleSelectStore = (store: typeof MOCK_STORES[0]) => {
    setDeliveryInfo({
      storeId: store.id,
      storeName: store.name,
      storeAddress: store.address,
    });
    setShowStoreSelector(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {step?.number} · Delivery Information
        </h2>
        <p className="text-gray-500 mt-1">
          Enter recipient details and select a pickup location.
        </p>
      </div>

      {/* Recipient Info */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">Recipient Information</h4>
          <button
            type="button"
            onClick={usePurchaserInfoForDelivery}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Use purchaser info
          </button>
        </div>

        <FormInput
          label="Full Name"
          required
          type="text"
          value={deliveryInfo.fullName}
          onChange={(e) => setDeliveryInfo({ fullName: e.target.value })}
          placeholder="Enter recipient name"
        />

        <FormInput
          label="Email"
          required
          type="email"
          value={deliveryInfo.email}
          onChange={(e) => setDeliveryInfo({ email: e.target.value })}
          placeholder="email@example.com"
        />

        <FormInput
          label="Mobile Phone"
          required
          type="tel"
          value={deliveryInfo.phone}
          onChange={(e) => setDeliveryInfo({ phone: e.target.value })}
          placeholder="0912 345 678"
        />
      </div>

      {/* Shipping Method */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-900">
          Shipping Method<span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <span className="font-medium text-gray-900">7-ELEVEN Store Pickup</span>
              <p className="text-sm text-gray-500">Pick up your order at a nearby 7-ELEVEN store.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Store Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-900">
          Pickup Store<span className="text-red-500 ml-0.5">*</span>
        </label>

        {deliveryInfo.storeId ? (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-900">{deliveryInfo.storeName}</p>
                <p className="text-sm text-gray-500 mt-0.5">Store ID: {deliveryInfo.storeId}</p>
                <p className="text-sm text-gray-500">{deliveryInfo.storeAddress}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowStoreSelector(true)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Change
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowStoreSelector(true)}
            className={cn(
              'w-full py-3 px-4 rounded-xl border-2 border-dashed',
              'border-gray-300 bg-gray-50 text-gray-600',
              'hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600',
              'transition-colors flex items-center justify-center gap-2'
            )}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Select 7-ELEVEN store
          </button>
        )}
      </div>

      {/* Store Selector Modal */}
      {showStoreSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowStoreSelector(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Select 7-ELEVEN Store
                </h3>
                <button
                  type="button"
                  onClick={() => setShowStoreSelector(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="space-y-2">
                {MOCK_STORES.map((store) => (
                  <button
                    key={store.id}
                    type="button"
                    onClick={() => handleSelectStore(store)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg border transition-colors',
                      deliveryInfo.storeId === store.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    )}
                  >
                    <p className="font-medium text-gray-900">{store.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">ID: {store.id}</p>
                    <p className="text-sm text-gray-500">{store.address}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
