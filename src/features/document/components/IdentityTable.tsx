'use client';

import { IDENTITY_CAPABILITIES } from '../data/playbook-content';
import { cn } from '@/lib/utils';

function CheckIcon({ checked }: { checked: boolean | string }) {
  if (typeof checked === 'string') {
    return <span className="text-xs text-neutral-400">{checked}</span>;
  }
  return checked ? (
    <svg
      className="w-5 h-5 text-green-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ) : (
    <svg
      className="w-5 h-5 text-neutral-600"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

export function IdentityTable() {
  const headers = [
    { key: 'feature', label: 'Feature', className: 'text-left' },
    { key: 'guest', label: 'Guest', className: 'text-center' },
    { key: 'explorer', label: 'Explorer', className: 'text-center' },
    { key: 'soloTraveler', label: 'Solo', className: 'text-center' },
    { key: 'duoGo', label: 'Go', className: 'text-center' },
    { key: 'duoRun', label: 'Run', className: 'text-center' },
    { key: 'duoFly', label: 'Fly', className: 'text-center' },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-neutral-900/80 border-b border-neutral-800">
            {headers.map((header) => (
              <th
                key={header.key}
                className={cn(
                  'px-4 py-3 font-semibold text-neutral-300',
                  header.className
                )}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {IDENTITY_CAPABILITIES.map((row, index) => (
            <tr
              key={row.feature}
              className={cn(
                'border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors',
                index % 2 === 0 ? 'bg-neutral-900/30' : ''
              )}
            >
              <td className="px-4 py-3 text-neutral-200 font-medium">
                {row.feature}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center">
                  <CheckIcon checked={row.guest} />
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center">
                  <CheckIcon checked={row.explorer} />
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center">
                  <CheckIcon checked={row.soloTraveler} />
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center">
                  <CheckIcon checked={row.duoGo} />
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center">
                  <CheckIcon checked={row.duoRun} />
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center">
                  <CheckIcon checked={row.duoFly} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
