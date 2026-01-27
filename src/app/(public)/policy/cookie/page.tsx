import { Metadata } from 'next';
import { MarkdownContent } from '@/components/molecules';
import { COOKIE_POLICY, COMPANY_INFO } from '@/Database/content/policy-content';

export const metadata: Metadata = {
  title: `Cookie 政策 | ${COMPANY_INFO.name}`,
  description: '了解 nuvaClub 如何使用 Cookie 及類似技術。',
};

export default function CookiePolicyPage() {
  return <MarkdownContent content={COOKIE_POLICY} />;
}
