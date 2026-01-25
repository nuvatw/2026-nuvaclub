'use client';

import { cn } from '@/lib/utils';

interface VisibilityNoticeProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function VisibilityNotice({
  checked,
  onCheckedChange,
  className,
}: VisibilityNoticeProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-amber-500/30 bg-amber-500/10 p-4',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">&#9888;&#65039;</div>
        <div className="flex-1">
          <h4 className="font-semibold text-amber-400 mb-2">
            PUBLIC PROJECT NOTICE
          </h4>
          <p className="text-sm text-neutral-300 mb-3">
            Your project will be publicly visible to all NuvaClub users and
            visitors during the sprint period. This enables:
          </p>
          <ul className="text-sm text-neutral-400 space-y-1 mb-4 ml-4 list-disc">
            <li>Community voting on your submission</li>
            <li>Feedback and comments from other members</li>
            <li>Visibility in sprint rankings and showcases</li>
          </ul>
          <p className="text-sm text-neutral-300 mb-4">
            After the sprint ends, you can choose to:
          </p>
          <ul className="text-sm text-neutral-400 space-y-1 mb-4 ml-4 list-disc">
            <li>Keep it public for everyone</li>
            <li>Make it private (NuvaClub members only)</li>
          </ul>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => onCheckedChange(e.target.checked)}
              className="w-5 h-5 rounded border-neutral-600 bg-neutral-800 text-primary-500 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
            />
            <span className="text-sm text-white group-hover:text-primary-400 transition-colors">
              I understand my project will be publicly visible during the sprint
              and I consent to these terms.
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
