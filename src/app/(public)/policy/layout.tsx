import { ArrowLeftIcon } from '@/components/icons';
import Link from 'next/link';

export default function PolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeftIcon size="sm" />
          <span>返回首頁</span>
        </Link>

        {/* Content */}
        <div className="rounded-2xl p-6 md:p-10 border border-neutral-700 bg-neutral-800/30">
          {children}
        </div>

        {/* Footer links */}
        <div className="mt-8 pt-8 border-t border-neutral-800">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-neutral-500">
            <Link
              href="/policy/cookie"
              className="hover:text-white transition-colors"
            >
              Cookie 政策
            </Link>
            <span className="text-neutral-700">|</span>
            <Link
              href="/policy/privacy"
              className="hover:text-white transition-colors"
            >
              隱私權政策
            </Link>
            <span className="text-neutral-700">|</span>
            <Link
              href="/policy/terms"
              className="hover:text-white transition-colors"
            >
              服務條款
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
