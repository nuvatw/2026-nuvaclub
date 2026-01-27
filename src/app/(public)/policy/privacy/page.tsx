import { Metadata } from 'next';
import { MarkdownContent } from '@/components/molecules';
import { PRIVACY_POLICY, COMPANY_INFO } from '@/Database/content/policy-content';

export const metadata: Metadata = {
  title: `隱私權政策 | ${COMPANY_INFO.name}`,
  description: '了解 nuvaClub 如何收集、使用和保護您的個人資料。',
};

export default function PrivacyPolicyPage() {
  return <MarkdownContent content={PRIVACY_POLICY} />;
}
