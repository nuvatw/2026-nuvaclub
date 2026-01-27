import { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY_INFO } from '@/Database/content/policy-content';
import {
  SettingsIcon,
  ShieldIcon,
  DocumentIcon,
} from '@/components/icons';

export const metadata: Metadata = {
  title: `法律條款 | ${COMPANY_INFO.name}`,
  description: '查看 nuvaClub 的隱私權政策、Cookie 政策和服務條款。',
};

const policies = [
  {
    title: 'Cookie 政策',
    description: '了解我們如何使用 Cookie 及類似技術來改善您的使用體驗。',
    href: '/policy/cookie',
    icon: SettingsIcon,
  },
  {
    title: '隱私權政策',
    description: '了解我們如何收集、使用和保護您的個人資料。',
    href: '/policy/privacy',
    icon: ShieldIcon,
  },
  {
    title: '服務條款',
    description: '閱讀使用 nuvaClub 服務的條款和規範。',
    href: '/policy/terms',
    icon: DocumentIcon,
  },
];

export default function PolicyIndexPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-4">法律條款</h1>
      <p className="text-neutral-400 mb-8">
        以下是 {COMPANY_INFO.name} 的法律條款和政策文件。
      </p>

      <div className="grid gap-4">
        {policies.map((policy) => (
          <Link
            key={policy.href}
            href={policy.href}
            className="group block p-6 rounded-xl border border-neutral-700 bg-neutral-800/50 hover:bg-neutral-800 hover:border-neutral-600 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary-500/10 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                <policy.icon size="md" className="text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
                  {policy.title}
                </h2>
                <p className="text-neutral-400 text-sm">{policy.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-neutral-700">
        <h2 className="text-lg font-semibold text-white mb-4">公司資訊</h2>
        <div className="text-neutral-400 text-sm space-y-2">
          <p>
            <span className="text-neutral-500">公司名稱：</span>
            {COMPANY_INFO.name}
          </p>
          <p>
            <span className="text-neutral-500">統一編號：</span>
            {COMPANY_INFO.taxId}
          </p>
          <p>
            <span className="text-neutral-500">地址：</span>
            {COMPANY_INFO.address}
          </p>
          <p>
            <span className="text-neutral-500">聯絡信箱：</span>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="text-primary-400 hover:underline"
            >
              {COMPANY_INFO.email}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
