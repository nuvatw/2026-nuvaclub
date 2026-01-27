import { Metadata } from 'next';
import { MarkdownContent } from '@/components/molecules';
import { TERMS_OF_SERVICE, COMPANY_INFO } from '@/Database/content/policy-content';

export const metadata: Metadata = {
  title: `服務條款 | ${COMPANY_INFO.name}`,
  description: '閱讀 nuvaClub 的服務條款和使用規範。',
};

export default function TermsOfServicePage() {
  return <MarkdownContent content={TERMS_OF_SERVICE} />;
}
