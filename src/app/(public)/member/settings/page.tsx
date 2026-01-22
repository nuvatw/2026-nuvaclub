'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { cn } from '@/lib/utils';

interface SettingSection {
  title: string;
  description: string;
  settings: Setting[];
}

interface Setting {
  id: string;
  label: string;
  description: string;
  type: 'toggle' | 'select' | 'button';
  value?: boolean | string;
  options?: { value: string; label: string }[];
  buttonLabel?: string;
  buttonVariant?: 'primary' | 'danger';
}

const SETTINGS_SECTIONS: SettingSection[] = [
  {
    title: 'Notifications',
    description: 'Manage how you receive notifications from nuvaClub.',
    settings: [
      {
        id: 'email-notifications',
        label: 'Email Notifications',
        description: 'Receive email updates about your courses and activity.',
        type: 'toggle',
        value: true,
      },
      {
        id: 'course-updates',
        label: 'Course Updates',
        description: 'Get notified when new lessons are added to your courses.',
        type: 'toggle',
        value: true,
      },
      {
        id: 'forum-replies',
        label: 'Forum Replies',
        description: 'Receive notifications when someone replies to your posts.',
        type: 'toggle',
        value: true,
      },
      {
        id: 'marketing-emails',
        label: 'Marketing Emails',
        description: 'Receive promotional emails and special offers.',
        type: 'toggle',
        value: false,
      },
    ],
  },
  {
    title: 'Appearance',
    description: 'Customize how nuvaClub looks and feels.',
    settings: [
      {
        id: 'theme',
        label: 'Theme',
        description: 'Choose your preferred color theme.',
        type: 'select',
        value: 'dark',
        options: [
          { value: 'dark', label: 'Dark' },
          { value: 'light', label: 'Light' },
          { value: 'system', label: 'System' },
        ],
      },
      {
        id: 'language',
        label: 'Language',
        description: 'Select your preferred language.',
        type: 'select',
        value: 'en',
        options: [
          { value: 'en', label: 'English' },
          { value: 'zh-TW', label: '繁體中文' },
          { value: 'zh-CN', label: '简体中文' },
          { value: 'ja', label: '日本語' },
        ],
      },
      {
        id: 'video-autoplay',
        label: 'Video Autoplay',
        description: 'Automatically play videos when navigating to a lesson.',
        type: 'toggle',
        value: true,
      },
    ],
  },
  {
    title: 'Privacy',
    description: 'Control your privacy and data settings.',
    settings: [
      {
        id: 'profile-visibility',
        label: 'Profile Visibility',
        description: 'Control who can see your profile.',
        type: 'select',
        value: 'public',
        options: [
          { value: 'public', label: 'Public' },
          { value: 'members', label: 'Members Only' },
          { value: 'private', label: 'Private' },
        ],
      },
      {
        id: 'show-progress',
        label: 'Show Learning Progress',
        description: 'Allow others to see your course progress.',
        type: 'toggle',
        value: true,
      },
      {
        id: 'activity-status',
        label: 'Activity Status',
        description: 'Show when you are online.',
        type: 'toggle',
        value: true,
      },
    ],
  },
  {
    title: 'Account',
    description: 'Manage your account and data.',
    settings: [
      {
        id: 'export-data',
        label: 'Export Data',
        description: 'Download a copy of all your data.',
        type: 'button',
        buttonLabel: 'Export Data',
        buttonVariant: 'primary',
      },
      {
        id: 'delete-account',
        label: 'Delete Account',
        description: 'Permanently delete your account and all associated data. This action cannot be undone.',
        type: 'button',
        buttonLabel: 'Delete Account',
        buttonVariant: 'danger',
      },
    ],
  },
];

function ToggleSetting({ setting, onChange }: { setting: Setting; onChange: (value: boolean) => void }) {
  const [enabled, setEnabled] = useState(setting.value as boolean);

  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    onChange(newValue);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
        enabled ? 'bg-primary-500' : 'bg-neutral-700'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          enabled ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}

function SelectSetting({ setting, onChange }: { setting: Setting; onChange: (value: string) => void }) {
  const [value, setValue] = useState(setting.value as string);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className="bg-neutral-800 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
    >
      {setting.options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function ButtonSetting({ setting, onClick }: { setting: Setting; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
        setting.buttonVariant === 'danger'
          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
          : 'bg-primary-500/10 text-primary-400 hover:bg-primary-500/20'
      )}
    >
      {setting.buttonLabel}
    </button>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [saved, setSaved] = useState(false);

  const handleSettingChange = (settingId: string, value: boolean | string) => {
    console.log(`Setting ${settingId} changed to:`, value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleButtonClick = (settingId: string) => {
    if (settingId === 'export-data') {
      alert('Your data export will be sent to your email.');
    } else if (settingId === 'delete-account') {
      if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        alert('Account deletion requested. You will receive a confirmation email.');
        logout();
      }
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-neutral-400 mt-1">Manage your account preferences and settings.</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Settings saved
          </div>
        )}
      </div>

      {/* Settings Sections */}
      {SETTINGS_SECTIONS.map((section) => (
        <div
          key={section.title}
          className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden"
        >
          <div className="p-6 border-b border-neutral-800">
            <h2 className="text-lg font-semibold text-white">{section.title}</h2>
            <p className="text-sm text-neutral-400 mt-1">{section.description}</p>
          </div>

          <div className="divide-y divide-neutral-800">
            {section.settings.map((setting) => (
              <div key={setting.id} className="p-6 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-white">{setting.label}</p>
                  <p className="text-sm text-neutral-400 mt-0.5">{setting.description}</p>
                </div>
                <div>
                  {setting.type === 'toggle' && (
                    <ToggleSetting
                      setting={setting}
                      onChange={(value) => handleSettingChange(setting.id, value)}
                    />
                  )}
                  {setting.type === 'select' && (
                    <SelectSetting
                      setting={setting}
                      onChange={(value) => handleSettingChange(setting.id, value)}
                    />
                  )}
                  {setting.type === 'button' && (
                    <ButtonSetting
                      setting={setting}
                      onClick={() => handleButtonClick(setting.id)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Danger Zone */}
      <div className="bg-neutral-900 rounded-xl border border-red-500/30 overflow-hidden">
        <div className="p-6 border-b border-neutral-800">
          <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
          <p className="text-sm text-neutral-400 mt-1">Irreversible and destructive actions.</p>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-white">Sign Out of All Devices</p>
              <p className="text-sm text-neutral-400 mt-0.5">
                This will sign you out of all devices and sessions.
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Sign out of all devices?')) {
                  alert('You have been signed out of all devices.');
                  logout();
                }
              }}
              className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
            >
              Sign Out All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
