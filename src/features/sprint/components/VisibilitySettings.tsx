'use client';

import { useState } from 'react';
import { Button, Card, CardContent } from '@/components/atoms';
import type { ProjectVisibility } from '@/infra/mock/schema/sprint.schema';
import { cn } from '@/lib/utils';

interface VisibilitySettingsProps {
  currentVisibility: ProjectVisibility;
  projectUrl: string;
  onVisibilityChange: (visibility: ProjectVisibility) => void;
  isSprintActive?: boolean;
}

const visibilityLabels: Record<ProjectVisibility, { label: string; icon: string }> = {
  'sprint-public': { label: 'Sprint Public (Pending Choice)', icon: '⏳' },
  'nuvaclub-only': { label: 'NuvaClub Members Only', icon: '🔒' },
  public: { label: 'Public for Everyone', icon: '🌍' },
};

export function VisibilitySettings({
  currentVisibility,
  projectUrl,
  onVisibilityChange,
  isSprintActive = false,
}: VisibilitySettingsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const currentLabel = visibilityLabels[currentVisibility];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <svg
              className="w-5 h-5 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Project Settings
          </h3>
        </div>

        {/* Visibility Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-neutral-400">Visibility</h4>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800/50">
            <span className="text-xl">{currentLabel.icon}</span>
            <div className="flex-1">
              <span className="text-white font-medium">{currentLabel.label}</span>
            </div>
          </div>

          {isSprintActive ? (
            <p className="text-xs text-neutral-500">
              Visibility cannot be changed while the sprint is active.
            </p>
          ) : (
            <div className="flex gap-2">
              <Button
                variant={currentVisibility === 'nuvaclub-only' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onVisibilityChange('nuvaclub-only')}
                className={cn(
                  currentVisibility === 'nuvaclub-only' && 'ring-1 ring-primary-500'
                )}
              >
                🔒 Make NuvaClub Only
              </Button>
              <Button
                variant={currentVisibility === 'public' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => onVisibilityChange('public')}
                className={cn(
                  currentVisibility === 'public' && 'ring-1 ring-primary-500'
                )}
              >
                🌍 Make Public
              </Button>
            </div>
          )}

          {/* Share Link */}
          {currentVisibility === 'public' && (
            <div className="mt-4 pt-4 border-t border-neutral-700">
              <h4 className="text-sm font-medium text-neutral-400 mb-2">
                Share Link
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={projectUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 focus:outline-none"
                />
                <Button variant="secondary" size="sm" onClick={handleCopyLink}>
                  {copied ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-1"
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
                      Copied
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
